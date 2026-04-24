'use client'

import { motion } from 'framer-motion'
import { WishlistItem, WISHLIST_STATUS_CONFIG } from '@/types'

interface Props {
  item: WishlistItem
  onClick: () => void
  onGifted: (item: WishlistItem) => void
  index: number
}

export default function WishlistCard({ item, onClick, onGifted, index }: Props) {
  const statusCfg = WISHLIST_STATUS_CONFIG[item.status]
  const isGifted = item.status === 'gifted'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-3xl overflow-hidden shadow-sm border cursor-pointer hover:shadow-md transition-shadow active:scale-95
        ${isGifted ? 'border-[#FFB5C8] bg-gradient-to-b from-[#FFF9F0] to-[#FFE8D6]' : 'border-[#FFE8D6] bg-white'}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-square bg-[#FFF9F0] flex items-center justify-center overflow-hidden relative">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🛍️</span>
        )}
        {isGifted && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <span className="text-4xl">🎁</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-bold text-[#3D2C35] line-clamp-2 leading-snug mb-1.5">
          {item.title}
        </p>
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-2"
          style={{ backgroundColor: statusCfg.color }}
        >
          {statusCfg.emoji} {statusCfg.label}
        </div>
        {item.note && (
          <p className="text-xs text-[#C4A0B0] mb-2 line-clamp-2">{item.note}</p>
        )}

        {/* Gift button — only for 'want' items */}
        {!isGifted && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={e => { e.stopPropagation(); onGifted(item) }}
            className="w-full py-1.5 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white text-xs font-bold"
          >
            🎁 Đã được tặng
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
