'use client'

import { motion } from 'framer-motion'
import { WishlistItem, WISHLIST_STATUS_CONFIG } from '@/types'

interface Props {
  item: WishlistItem
  onClick: () => void
  index: number
}

export default function WishlistCard({ item, onClick, index }: Props) {
  const statusCfg = WISHLIST_STATUS_CONFIG[item.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#FFE8D6] cursor-pointer hover:shadow-md transition-shadow active:scale-95"
    >
      {/* Image */}
      <div className="aspect-square bg-[#FFF9F0] flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🛍️</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-bold text-[#3D2C35] line-clamp-2 leading-snug mb-1.5">
          {item.title}
        </p>
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: statusCfg.color }}
        >
          {statusCfg.emoji} {statusCfg.label}
        </div>
        {item.note && (
          <p className="text-xs text-[#C4A0B0] mt-1.5 line-clamp-2">{item.note}</p>
        )}
      </div>
    </motion.div>
  )
}
