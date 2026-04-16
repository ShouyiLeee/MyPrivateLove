'use client'

import { motion } from 'framer-motion'
import { daysBetween, formatDayCount } from '@/lib/helpers'
import { Relationship } from '@/types'

export default function LoveCounter({ relationship }: { relationship: Relationship | null }) {
  if (!relationship?.start_date) {
    return (
      <div className="bg-gradient-to-r from-[#FFD6E0] to-[#E8D5F5] rounded-3xl p-6 text-center shadow-sm">
        <div className="text-4xl mb-2">💕</div>
        <p className="text-[#7A5C6B] text-sm">Chưa cài ngày bắt đầu</p>
        <p className="text-xs text-[#C4A0B0] mt-1">Vào Hồ sơ để thêm nhé</p>
      </div>
    )
  }

  const days = daysBetween(relationship.start_date)
  const coupleName = relationship.couple_name || 'Chúng mình'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-[#FFD6E0] to-[#E8D5F5] rounded-3xl p-6 text-center shadow-sm relative overflow-hidden"
    >
      {/* Floating hearts */}
      {['💕', '🌸', '✨'].map((e, i) => (
        <motion.span
          key={i}
          className="absolute text-lg opacity-30 pointer-events-none"
          style={{ left: `${15 + i * 35}%`, top: `${10 + (i % 2) * 30}%` }}
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity }}
        >
          {e}
        </motion.span>
      ))}

      <p className="text-sm text-[#7A5C6B] font-semibold mb-1">{coupleName} đã bên nhau</p>
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-5xl font-extrabold text-[#FF85A1] my-2"
      >
        {formatDayCount(days)}
      </motion.div>
      <p className="text-xs text-[#C4A0B0]">
        Từ {new Date(relationship.start_date + 'T00:00:00').toLocaleDateString('vi-VN')} 💖
      </p>
    </motion.div>
  )
}
