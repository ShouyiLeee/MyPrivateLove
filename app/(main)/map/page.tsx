'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry } from '@/types'

// Leaflet must be loaded client-side only (no SSR)
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[60vh] rounded-3xl bg-[#FFE8D6] flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-4xl"
      >
        🗺️
      </motion.div>
    </div>
  ),
})

export default function MapPage() {
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
        .not('location_lat', 'is', null)
      setEntries(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const locCount = entries.filter(e => e.location_lat).length

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3D2C35]">Bản đồ ký ức 🗺️</h1>
          <p className="text-sm text-[#C4A0B0]">{locCount} địa điểm đã lưu</p>
        </div>
      </div>

      {/* Map */}
      {loading ? (
        <div className="w-full h-[60vh] rounded-3xl bg-[#FFE8D6] flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-4xl"
          >
            🌸
          </motion.div>
        </div>
      ) : locCount === 0 ? (
        <div className="w-full h-[50vh] rounded-3xl bg-[#FFE8D6] flex flex-col items-center justify-center gap-3">
          <span className="text-5xl">🗺️</span>
          <p className="text-[#7A5C6B] font-semibold">Chưa có địa điểm nào</p>
          <p className="text-xs text-[#C4A0B0] text-center px-8">
            Khi viết nhật ký, hãy bật vị trí để lưu địa điểm trên bản đồ nhé!
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl overflow-hidden shadow-md border border-[#FFD6E0]"
        >
          <MapView entries={entries} />
        </motion.div>
      )}

      {/* Recent locations list */}
      {locCount > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#3D2C35] mb-3">Địa điểm gần đây 📍</h3>
          <div className="space-y-2">
            {entries.slice(0, 5).map(entry => (
              <div key={entry.id} className="bg-white rounded-2xl p-3 flex items-center gap-3 border border-[#FFE8D6] shadow-sm">
                <span className="text-xl">📍</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#3D2C35] truncate">
                    {entry.location_name ?? 'Vị trí đã lưu'}
                  </p>
                  <p className="text-xs text-[#C4A0B0]">
                    {new Date(entry.date + 'T00:00:00').toLocaleDateString('vi-VN')}
                  </p>
                </div>
                {entry.mood && <span className="text-xl">{/* MOOD_CONFIG[entry.mood]?.emoji */}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
