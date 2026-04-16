'use client'

import { motion } from 'framer-motion'
import { DailyEntry, MOOD_CONFIG, TAG_CONFIG } from '@/types'
import { formatDateVi } from '@/lib/helpers'

export default function TimelineItem({ entry, index }: { entry: DailyEntry; index: number }) {
  const mood = entry.mood ? MOOD_CONFIG[entry.mood] : null
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`flex gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content card */}
      <div className="flex-1">
        <div
          className="bg-white rounded-3xl p-4 shadow-sm border border-[#FFE8D6]"
          style={{ borderLeftColor: mood?.color ?? '#FFE8D6', borderLeftWidth: 3 }}
        >
          {/* Date + mood */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#C4A0B0]">{formatDateVi(entry.date)}</span>
            {mood && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: mood.color }}>
                {mood.emoji} {mood.label}
              </div>
            )}
          </div>

          {/* Note */}
          {entry.note && (
            <p className="text-sm text-[#3D2C35] leading-relaxed mb-3">{entry.note}</p>
          )}

          {/* Tags */}
          {entry.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {entry.tags.map(tag => {
                const cfg = TAG_CONFIG[tag]
                return (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: cfg.color }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                )
              })}
            </div>
          )}

          {/* Images */}
          {entry.images?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {entry.images.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              ))}
            </div>
          )}

          {/* Location */}
          {entry.location_name && (
            <p className="text-xs text-[#C4A0B0] mt-2 flex items-center gap-1">
              <span>📍</span>{entry.location_name}
            </p>
          )}
        </div>
      </div>

      {/* Center dot */}
      <div className="flex flex-col items-center pt-3 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#FFB5C8] ring-2 ring-white shadow-sm z-10" />
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1" />
    </motion.div>
  )
}
