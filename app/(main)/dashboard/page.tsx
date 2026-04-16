'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry, MoodType, Relationship } from '@/types'
import LoveCounter from '@/components/dashboard/LoveCounter'
import MoodStats from '@/components/dashboard/MoodStats'
import StatsCard from '@/components/dashboard/StatsCard'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Bé yêu')
  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [entries, setEntries] = useState<DailyEntry[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [profileRes, entriesRes, relRes] = await Promise.all([
        supabase.from('profiles').select('name').eq('id', user.id).single(),
        supabase.from('daily_entries').select('*').eq('user_id', user.id),
        supabase.from('relationship').select('*').eq('id', 1).single(),
      ])

      if (profileRes.data) setUserName(profileRes.data.name ?? 'Bé yêu')
      if (entriesRes.data) setEntries(entriesRes.data)
      if (relRes.data) setRelationship(relRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const memoriesCount = entries.filter(e => e.tags?.includes('memory')).length
  const datesCount = entries.filter(e => e.tags?.includes('date')).length
  const uniqueDays = new Set(entries.map(e => e.date)).size

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-4xl"
        >
          💕
        </motion.div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-[#C4A0B0] text-sm">Xin chào,</p>
          <h1 className="text-2xl font-extrabold text-[#3D2C35]">{userName} 🌸</h1>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="text-3xl"
        >
          💖
        </motion.div>
      </motion.div>

      {/* Love Counter */}
      <LoveCounter relationship={relationship} />

      {/* Stats Grid */}
      <div>
        <h3 className="text-sm font-bold text-[#3D2C35] mb-3">Thống kê của em ✨</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatsCard emoji="📝" label="Ngày đã ghi" value={uniqueDays} color="#FFE8D6" delay={0.1} />
          <StatsCard emoji="💝" label="Kỷ niệm" value={memoriesCount} color="#FFD6E0" delay={0.2} />
          <StatsCard emoji="💑" label="Hẹn hò" value={datesCount} color="#E8D5F5" delay={0.3} />
        </div>
      </div>

      {/* Mood Stats */}
      <MoodStats entries={entries} />

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3 pb-2"
      >
        <button
          onClick={() => router.push('/calendar')}
          className="bg-white rounded-3xl p-4 shadow-sm border border-[#FFE8D6] flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <span className="text-2xl">📅</span>
          <div className="text-left">
            <p className="text-sm font-bold text-[#3D2C35]">Ghi hôm nay</p>
            <p className="text-xs text-[#C4A0B0]">Mở lịch</p>
          </div>
        </button>
        <button
          onClick={() => router.push('/map')}
          className="bg-white rounded-3xl p-4 shadow-sm border border-[#FFE8D6] flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <span className="text-2xl">🗺️</span>
          <div className="text-left">
            <p className="text-sm font-bold text-[#3D2C35]">Bản đồ ký ức</p>
            <p className="text-xs text-[#C4A0B0]">Xem địa điểm</p>
          </div>
        </button>
      </motion.div>
    </div>
  )
}
