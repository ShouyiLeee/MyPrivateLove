'use client'

import { motion } from 'framer-motion'

interface Props {
  emoji: string
  label: string
  value: string | number
  color: string
  delay?: number
}

export default function StatsCard({ emoji, label, value, color, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center justify-center rounded-3xl p-4 shadow-sm"
      style={{ backgroundColor: color }}
    >
      <span className="text-2xl mb-1">{emoji}</span>
      <span className="text-xl font-extrabold text-[#3D2C35]">{value}</span>
      <span className="text-xs text-[#7A5C6B] font-semibold mt-0.5 text-center">{label}</span>
    </motion.div>
  )
}
