'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DailyEntry, MOOD_CONFIG } from '@/types'
import { formatDateVi } from '@/lib/helpers'

interface PhotoItem {
  url: string
  entry: DailyEntry
}

interface Props {
  photos: PhotoItem[]
}

export default function PhotoGrid({ photos }: Props) {
  const [selected, setSelected] = useState<PhotoItem | null>(null)

  return (
    <>
      {/* Masonry-style grid using CSS columns */}
      <div className="columns-2 gap-2 space-y-2">
        {photos.map((photo, i) => (
          <motion.div
            key={`${photo.entry.id}-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer"
            onClick={() => setSelected(photo)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt=""
              className="w-full object-cover"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <div>
                {photo.entry.mood && (
                  <span className="text-lg">{MOOD_CONFIG[photo.entry.mood]?.emoji}</span>
                )}
                <p className="text-white text-xs font-semibold">{formatDateVi(photo.entry.date)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.url} alt="" className="w-full object-cover max-h-72" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {selected.entry.mood && (
                    <span className="text-xl">{MOOD_CONFIG[selected.entry.mood]?.emoji}</span>
                  )}
                  <span className="text-sm font-bold text-[#3D2C35]">
                    {formatDateVi(selected.entry.date)}
                  </span>
                </div>
                {selected.entry.note && (
                  <p className="text-sm text-[#7A5C6B] leading-relaxed line-clamp-4">
                    {selected.entry.note}
                  </p>
                )}
                {selected.entry.location_name && (
                  <p className="text-xs text-[#C4A0B0] mt-2 flex items-center gap-1">
                    📍 {selected.entry.location_name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 text-[#C4A0B0] text-sm font-semibold border-t border-[#FFE8D6] hover:bg-[#FFF9F0] transition-colors"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
