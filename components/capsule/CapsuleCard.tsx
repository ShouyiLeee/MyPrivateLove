'use client'

import { motion } from 'framer-motion'
import { TimeCapsule } from '@/types'
import { daysUntil, formatDateVi } from '@/lib/helpers'

interface Props {
  capsule: TimeCapsule
  onOpen: () => void
  onClick: () => void
  index: number
}

export default function CapsuleCard({ capsule, onOpen, onClick, index }: Props) {
  const remaining = daysUntil(capsule.open_date)
  const canOpen = remaining <= 0 && !capsule.is_opened
  const isOpened = capsule.is_opened

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`rounded-3xl p-4 border shadow-sm cursor-pointer transition-all
        ${isOpened ? 'bg-gradient-to-r from-[#FFD6E0] to-[#E8D5F5] border-[#FFB5C8]' :
          canOpen ? 'bg-gradient-to-r from-[#FFF9F0] to-[#FFE8D6] border-[#FFB5C8] ring-2 ring-[#FF85A1]' :
          'bg-white border-[#FFE8D6]'}`}
      onClick={isOpened ? onClick : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.div
          animate={canOpen ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-3xl flex-shrink-0"
        >
          {isOpened ? '💌' : canOpen ? '🎉' : '🔒'}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isOpened ? (
            <>
              <p className="text-xs font-bold text-[#FF85A1] mb-1">Đã mở • {formatDateVi(capsule.open_date)}</p>
              <p className="text-sm text-[#3D2C35] leading-relaxed line-clamp-3">{capsule.message}</p>
            </>
          ) : canOpen ? (
            <>
              <p className="text-xs font-bold text-[#FF85A1] mb-1">Đã đến ngày! 🎉</p>
              <p className="text-sm text-[#7A5C6B]">Thư từ quá khứ đang chờ em...</p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-[#C4A0B0] mb-1">
                Mở vào {formatDateVi(capsule.open_date)}
              </p>
              <p className="text-sm text-[#7A5C6B]">Còn {remaining} ngày nữa 💕</p>
              <p className="text-xs text-[#C4A0B0] mt-1">
                Viết {new Date(capsule.created_at).toLocaleDateString('vi-VN')}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Open button */}
      {canOpen && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={e => { e.stopPropagation(); onOpen() }}
          className="w-full mt-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold text-sm shadow-md"
        >
          💌 Mở thư ngay
        </motion.button>
      )}
    </motion.div>
  )
}
