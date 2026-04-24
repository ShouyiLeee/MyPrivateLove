'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry } from '@/types'
import PhotoGrid from '@/components/gallery/PhotoGrid'

interface PhotoItem {
  url: string
  entry: DailyEntry
}

export default function GalleryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .not('images', 'eq', '{}')
        .order('date', { ascending: false })

      const allPhotos: PhotoItem[] = []
      for (const entry of (data ?? []) as DailyEntry[]) {
        for (const url of (entry.images ?? [])) {
          allPhotos.push({ url, entry })
        }
      }
      setPhotos(allPhotos)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-2xl font-extrabold text-[#3D2C35]">Ký ức của em 🖼️</h1>
        <p className="text-sm text-[#C4A0B0]">{photos.length} khoảnh khắc</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-4xl">🌸</motion.div>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-5xl">🖼️</span>
          <p className="text-[#7A5C6B] font-semibold">Chưa có ảnh nào</p>
          <p className="text-xs text-[#C4A0B0] text-center px-8">
            Upload ảnh khi viết nhật ký để tạo album kỷ niệm nhé!
          </p>
        </div>
      ) : (
        <PhotoGrid photos={photos} />
      )}
    </div>
  )
}
