'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TimeCapsule } from '@/types'
import CapsuleCard from '@/components/capsule/CapsuleCard'
import CapsuleModal from '@/components/capsule/CapsuleModal'

export default function CapsulePage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [capsules, setCapsules] = useState<TimeCapsule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [viewCapsule, setViewCapsule] = useState<TimeCapsule | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data } = await supabase
        .from('time_capsules')
        .select('*')
        .eq('user_id', user.id)
        .order('open_date', { ascending: true })
      setCapsules(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  function handleSaved(capsule: TimeCapsule) {
    setCapsules(prev => [...prev, capsule].sort((a, b) => a.open_date.localeCompare(b.open_date)))
  }

  function handleOpened(capsule: TimeCapsule) {
    setCapsules(prev => prev.map(c => c.id === capsule.id ? capsule : c))
  }

  const openable = capsules.filter(c => !c.is_opened && c.open_date <= new Date().toISOString().split('T')[0])

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3D2C35]">Thư tương lai 💌</h1>
          <p className="text-sm text-[#C4A0B0]">{capsules.length} thư đã viết</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreate(true)}
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF85A1] to-[#FFB5C8] text-white text-xl flex items-center justify-center shadow-md"
        >
          +
        </motion.button>
      </div>

      {/* Openable alert */}
      {openable.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FFD6E0] to-[#E8D5F5] rounded-2xl p-4 mb-4 flex items-center gap-3"
        >
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-bold text-[#3D2C35]">Có {openable.length} thư đang chờ em!</p>
            <p className="text-xs text-[#7A5C6B]">Đã đến ngày mở rồi 💕</p>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-4xl">💌</motion.div>
        </div>
      ) : capsules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-5xl">💌</span>
          <p className="text-[#7A5C6B] font-semibold">Chưa có thư nào</p>
          <p className="text-xs text-[#C4A0B0] text-center px-8">
            Viết một thư gửi tương lai — cho bản thân hoặc người thương nhé!
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            className="mt-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold text-sm shadow-md"
          >
            Viết thư ngay ✍️
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {capsules.map((capsule, i) => (
            <CapsuleCard
              key={capsule.id}
              capsule={capsule}
              index={i}
              onClick={() => setViewCapsule(capsule)}
              onOpen={() => setViewCapsule(capsule)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && userId && (
        <CapsuleModal
          userId={userId}
          onClose={() => setShowCreate(false)}
          onSaved={handleSaved}
        />
      )}

      {/* View/open modal */}
      {viewCapsule && userId && (
        <CapsuleModal
          userId={userId}
          capsule={viewCapsule}
          onClose={() => setViewCapsule(null)}
          onOpened={c => { handleOpened(c); setViewCapsule(c) }}
        />
      )}
    </div>
  )
}
