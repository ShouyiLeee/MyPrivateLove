'use client'

import { motion } from 'framer-motion'
import { SpecialDay } from '@/types'
import { daysUntil, formatDateVi, specialDayEmoji } from '@/lib/helpers'

interface Props {
  day: SpecialDay
  onClick: () => void
  index: number
}

export default function SpecialDayCard({ day, onClick, index }: Props) {
  const remaining = daysUntil(day.date)
  const emoji = specialDayEmoji(day.title)

  let countdownText = ''
  let countdownColor = '#7A5C6B'
  if (remaining === 0) {
    countdownText = 'Hôm nay! 🎉'
    countdownColor = '#FF85A1'
  } else if (remaining > 0) {
    countdownText = `Còn ${remaining} ngày 💕`
  } else {
    countdownText = `${Math.abs(remaining)} ngày trước`
    countdownColor = '#C4A0B0'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={onClick}
      className="bg-white rounded-3xl p-4 flex items-center gap-3 shadow-sm border border-[#FFE8D6] cursor-pointer hover:shadow-md transition-shadow active:scale-98"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD6E0] to-[#E8D5F5] flex items-center justify-center text-2xl flex-shrink-0">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#3D2C35] truncate">{day.title}</p>
        <p className="text-xs text-[#C4A0B0]">{formatDateVi(day.date)}</p>
        {day.note && <p className="text-xs text-[#7A5C6B] truncate mt-0.5">{day.note}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-bold" style={{ color: countdownColor }}>{countdownText}</p>
      </div>
    </motion.div>
  )
}
