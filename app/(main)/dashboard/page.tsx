'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry, MoodType, Relationship, SpecialDay, TimeCapsule } from '@/types'
import { daysUntil, toDateString, specialDayEmoji } from '@/lib/helpers'
import LoveCounter from '@/components/dashboard/LoveCounter'
import MoodStats from '@/components/dashboard/MoodStats'
import StatsCard from '@/components/dashboard/StatsCard'

const QUICK_ACTIONS = [
  { href: '/calendar', icon: '📅', label: 'Nhật ký' },
  { href: '/gallery',  icon: '🖼️', label: 'Ảnh' },
  { href: '/map',      icon: '🗺️', label: 'Bản đồ' },
  { href: '/timeline', icon: '📖', label: 'Timeline' },
  { href: '/capsule',  icon: '💌', label: 'Thư TL' },
  { href: '/wishlist', icon: '💝', label: 'Wishlist' },
]

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Bé yêu')
  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([])
  const [capsules, setCapsules] = useState<TimeCapsule[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [profileRes, entriesRes, relRes, wishRes, specialRes, capsuleRes] = await Promise.all([
        supabase.from('profiles').select('name').eq('id', user.id).single(),
        supabase.from('daily_entries').select('*').eq('user_id', user.id),
        supabase.from('relationship').select('*').eq('id', 1).single(),
        supabase.from('wishlist_items').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('special_days').select('*').eq('user_id', user.id).order('date'),
        supabase.from('time_capsules').select('*').eq('user_id', user.id).eq('is_opened', false),
      ])

      if (profileRes.data) setUserName(profileRes.data.name ?? 'Bé yêu')
      if (entriesRes.data) setEntries(entriesRes.data)
      if (relRes.data) setRelationship(relRes.data)
      setWishlistCount(wishRes.count ?? 0)
      setSpecialDays(specialRes.data ?? [])
      setCapsules(capsuleRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const memoriesCount = entries.filter(e => e.tags?.includes('memory')).length
  const datesCount = entries.filter(e => e.tags?.includes('date')).length
  const uniqueDays = new Set(entries.map(e => e.date)).size
  const today = toDateString(new Date())

  // Next upcoming special day
  const nextSpecialDay = specialDays
    .filter(d => d.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  // Capsule that can be opened
  const openableCapsule = capsules.find(c => c.open_date <= today)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-4xl">💕</motion.div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="text-[#C4A0B0] text-sm">Xin chào,</p>
          <h1 className="text-2xl font-extrabold text-[#3D2C35]">{userName} 🌸</h1>
        </div>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} className="text-3xl">💖</motion.div>
      </motion.div>

      {/* Love Counter */}
      <LoveCounter relationship={relationship} />

      {/* Alerts: openable capsule */}
      {openableCapsule && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => router.push('/capsule')}
          className="bg-gradient-to-r from-[#FFD6E0] to-[#E8D5F5] rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
        >
          <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl">🎉</motion.span>
          <div>
            <p className="text-sm font-bold text-[#3D2C35]">Có thư tương lai đang chờ em!</p>
            <p className="text-xs text-[#7A5C6B]">Nhấn để mở 💌</p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div>
        <h3 className="text-sm font-bold text-[#3D2C35] mb-3">Thống kê ✨</h3>
        <div className="grid grid-cols-3 gap-2">
          <StatsCard emoji="📝" label="Ngày ghi" value={uniqueDays} color="#FFE8D6" delay={0.05} />
          <StatsCard emoji="💝" label="Kỷ niệm" value={memoriesCount} color="#FFD6E0" delay={0.1} />
          <StatsCard emoji="💑" label="Hẹn hò" value={datesCount} color="#E8D5F5" delay={0.15} />
          <StatsCard emoji="🛍️" label="Wishlist" value={wishlistCount} color="#FFF3B0" delay={0.2} />
          <StatsCard emoji="⭐" label="Ngày đặc biệt" value={specialDays.length} color="#FFE8D6" delay={0.25} />
          <StatsCard emoji="💌" label="Thư TL" value={capsules.length} color="#FFD6E0" delay={0.3} />
        </div>
      </div>

      {/* Sắp tới */}
      {nextSpecialDay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl p-4 border border-[#FFE8D6] shadow-sm"
        >
          <h3 className="text-xs font-bold text-[#C4A0B0] mb-2">SẮP TỚI 📌</h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{specialDayEmoji(nextSpecialDay.title)}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#3D2C35]">{nextSpecialDay.title}</p>
              <p className="text-xs text-[#C4A0B0]">
                {daysUntil(nextSpecialDay.date) === 0
                  ? 'Hôm nay! 🎉'
                  : `Còn ${daysUntil(nextSpecialDay.date)} ngày 💕`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mood Stats */}
      <MoodStats entries={entries} />

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h3 className="text-sm font-bold text-[#3D2C35] mb-3">Đi đến 🚀</h3>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.href}
              onClick={() => router.push(action.href)}
              className="bg-white rounded-2xl p-3 shadow-sm border border-[#FFE8D6] flex flex-col items-center gap-1.5 hover:shadow-md transition-shadow active:scale-95"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-semibold text-[#7A5C6B]">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
