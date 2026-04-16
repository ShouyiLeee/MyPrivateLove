'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry, MoodType, TagType, MOOD_CONFIG, TAG_CONFIG } from '@/types'

interface Props {
  date: string       // 'YYYY-MM-DD'
  userId: string
  onClose: () => void
  onSaved: (entry: DailyEntry) => void
}

export default function DailyEntryModal({ date, userId, onClose, onSaved }: Props) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [entryId, setEntryId] = useState<string | null>(null)
  const [mood, setMood] = useState<MoodType | null>(null)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState<TagType[]>([])
  const [images, setImages] = useState<string[]>([])
  const [locName, setLocName] = useState('')
  const [locLat, setLocLat] = useState<number | null>(null)
  const [locLng, setLocLng] = useState<number | null>(null)
  const [uploadingImg, setUploadingImg] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single()
      if (data) {
        setEntryId(data.id)
        setMood(data.mood)
        setNote(data.note ?? '')
        setTags(data.tags ?? [])
        setImages(data.images ?? [])
        setLocName(data.location_name ?? '')
        setLocLat(data.location_lat)
        setLocLng(data.location_lng)
      }
      setLoading(false)
    }
    load()
  }, [date, userId])

  function toggleTag(tag: TagType) {
    setTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag])
  }

  async function handleGetLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async pos => {
      setLocLat(pos.coords.latitude)
      setLocLng(pos.coords.longitude)
      // Reverse geocode with OSM Nominatim
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
        const d = await r.json()
        setLocName(d.display_name?.split(',').slice(0, 2).join(', ') ?? 'Vị trí hiện tại')
      } catch {
        setLocName('Vị trí hiện tại')
      }
    })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${date}-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('entry-images').upload(path, file)
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('entry-images').getPublicUrl(data.path)
      setImages(imgs => [...imgs, urlData.publicUrl])
    }
    setUploadingImg(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      user_id: userId,
      date,
      mood,
      note: note || null,
      tags,
      images,
      location_lat: locLat,
      location_lng: locLng,
      location_name: locName || null,
    }
    let result
    if (entryId) {
      result = await supabase.from('daily_entries').update(payload).eq('id', entryId).select().single()
    } else {
      result = await supabase.from('daily_entries').insert(payload).select().single()
    }
    setSaving(false)
    if (result.data) onSaved(result.data)
    onClose()
  }

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-[#3D2C35]">Nhật ký hôm nay 📝</h2>
              <p className="text-xs text-[#C4A0B0] capitalize">{displayDate}</p>
            </div>
            <button onClick={onClose} className="text-[#C4A0B0] text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFE8D6] transition-colors">✕</button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-3xl">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>🌸</motion.div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Mood */}
              <div>
                <p className="text-sm font-bold text-[#3D2C35] mb-2">Hôm nay em cảm thấy thế nào?</p>
                <div className="flex gap-2 flex-wrap">
                  {(Object.entries(MOOD_CONFIG) as [MoodType, typeof MOOD_CONFIG[MoodType]][]).map(([m, cfg]) => (
                    <button
                      key={m}
                      onClick={() => setMood(mood === m ? null : m)}
                      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all text-xs font-semibold ${mood === m ? 'scale-110 shadow-md ring-2 ring-[#FF85A1]' : 'bg-[#FFF9F0] hover:bg-[#FFE8D6]'}`}
                      style={{ backgroundColor: mood === m ? cfg.color : undefined }}
                    >
                      <span className="text-2xl">{cfg.emoji}</span>
                      <span className="text-[#7A5C6B]">{cfg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <p className="text-sm font-bold text-[#3D2C35] mb-2">Kể cho mình nghe nào 💌</p>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Hôm nay em đã làm gì? Cảm thấy thế nào?..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] focus:border-[#FFB5C8] transition-colors text-[#3D2C35] placeholder-[#C4A0B0] text-sm resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <p className="text-sm font-bold text-[#3D2C35] mb-2">Gắn thẻ 🏷️</p>
                <div className="flex gap-2">
                  {(Object.entries(TAG_CONFIG) as [TagType, typeof TAG_CONFIG[TagType]][]).map(([tag, cfg]) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${tags.includes(tag) ? 'text-white scale-105' : 'text-[#7A5C6B]'}`}
                      style={{ backgroundColor: tags.includes(tag) ? '#FF85A1' : cfg.color }}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <p className="text-sm font-bold text-[#3D2C35] mb-2">Ảnh kỷ niệm 📷</p>
                <div className="flex flex-wrap gap-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >✕</button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingImg}
                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#FFD6E0] flex flex-col items-center justify-center gap-1 text-[#C4A0B0] hover:border-[#FFB5C8] transition-colors"
                  >
                    {uploadingImg ? <span className="text-lg">⏳</span> : <><span className="text-2xl">+</span><span className="text-xs">Thêm ảnh</span></>}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm font-bold text-[#3D2C35] mb-2">Vị trí 📍</p>
                {locLat ? (
                  <div className="flex items-center gap-2 bg-[#FFE8D6] rounded-2xl px-3 py-2">
                    <span>📍</span>
                    <span className="text-xs text-[#7A5C6B] flex-1 truncate">{locName || 'Vị trí đã lưu'}</span>
                    <button onClick={() => { setLocLat(null); setLocLng(null); setLocName('') }} className="text-xs text-[#C4A0B0]">✕</button>
                  </div>
                ) : (
                  <button
                    onClick={handleGetLocation}
                    className="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#FFD6E0] text-[#C4A0B0] text-xs hover:border-[#FFB5C8] transition-colors"
                  >
                    📍 Lấy vị trí hiện tại
                  </button>
                )}
              </div>

              {/* Save */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold shadow-md"
              >
                {saving ? '💾 Đang lưu...' : '💾 Lưu nhật ký'}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
