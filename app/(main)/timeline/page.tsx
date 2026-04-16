'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry } from '@/types'
import TimelineItem from '@/components/timeline/TimelineItem'

export default function TimelinePage() {
  const router = useRouter()
  const supabase = createClient()
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      setEntries(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-extrabold text-[#3D2C35]">Dòng thời gian 📖</h1>
        <p className="text-sm text-[#C4A0B0]">{entries.length} khoảnh khắc đã lưu</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-4xl"
          >
            🌸
          </motion.div>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-5xl">📖</span>
          <p className="text-[#7A5C6B] font-semibold">Chưa có nhật ký nào</p>
          <p className="text-xs text-[#C4A0B0] text-center">
            Mở lịch và ghi lại những khoảnh khắc đẹp nhé!
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FFD6E0] via-[#E8D5F5] to-[#FFD6E0] -translate-x-1/2" />

          <div className="space-y-4">
            {entries.map((entry, i) => (
              <TimelineItem key={entry.id} entry={entry} index={i} />
            ))}
          </div>

          {/* End marker */}
          <div className="flex justify-center mt-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              💕
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
