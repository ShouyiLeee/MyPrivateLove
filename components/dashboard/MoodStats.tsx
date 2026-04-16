'use client'

import { motion } from 'framer-motion'
import { MOOD_CONFIG, MoodType } from '@/types'
import { calcMoodStats } from '@/lib/helpers'

interface Props {
  entries: { mood: MoodType | null }[]
}

export default function MoodStats({ entries }: Props) {
  const stats = calcMoodStats(entries)
  const moods = Object.entries(stats) as [MoodType, number][]

  if (moods.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FFE8D6] text-center">
        <p className="text-[#C4A0B0] text-sm">Chưa có dữ liệu cảm xúc 🌸</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FFE8D6]">
      <h3 className="text-sm font-bold text-[#3D2C35] mb-4">Cảm xúc của em 💭</h3>
      <div className="space-y-3">
        {moods.sort((a, b) => b[1] - a[1]).map(([mood, pct], i) => {
          const cfg = MOOD_CONFIG[mood]
          return (
            <motion.div
              key={mood}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <span className="text-xl w-7 text-center">{cfg.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-[#7A5C6B]">{cfg.label}</span>
                  <span className="text-xs font-bold text-[#3D2C35]">{pct}%</span>
                </div>
                <div className="h-2 bg-[#FFE8D6] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cfg.color }}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
