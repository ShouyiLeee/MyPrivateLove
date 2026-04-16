'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile, Relationship } from '@/types'
import { daysBetween } from '@/lib/helpers'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingRel, setEditingRel] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [coupleName, setCoupleName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setEmail(user.email ?? '')

      const [profileRes, relRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('relationship').select('*').eq('id', 1).single(),
      ])
      if (profileRes.data) setProfile(profileRes.data)
      if (relRes.data) {
        setRelationship(relRes.data)
        setStartDate(relRes.data.start_date ?? '')
        setCoupleName(relRes.data.couple_name ?? '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSaveRelationship() {
    setSaving(true)
    await supabase.from('relationship').upsert({
      id: 1,
      start_date: startDate || null,
      couple_name: coupleName || null,
    })
    setRelationship({ id: 1, start_date: startDate || null, couple_name: coupleName || null })
    setSaving(false)
    setEditingRel(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-4xl">💕</motion.div>
      </div>
    )
  }

  const prefs = profile?.preferences ?? {}

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#E8D5F5] flex items-center justify-center text-4xl mx-auto mb-3 shadow-md">
          {prefs.personality?.[0]?.split(' ')[0] ?? '🌸'}
        </div>
        <h1 className="text-2xl font-extrabold text-[#3D2C35]">{profile?.name ?? 'Bé yêu'}</h1>
        <p className="text-sm text-[#C4A0B0]">{email}</p>
      </motion.div>

      {/* Relationship */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FFE8D6]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#3D2C35]">💕 Chúng mình</h3>
          <button
            onClick={() => setEditingRel(!editingRel)}
            className="text-xs text-[#FF85A1] font-semibold hover:underline"
          >
            {editingRel ? 'Hủy' : 'Sửa'}
          </button>
        </div>

        {editingRel ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#7A5C6B] block mb-1">Ngày yêu nhau</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#7A5C6B] block mb-1">Tên của chúng mình</label>
              <input
                type="text"
                value={coupleName}
                onChange={e => setCoupleName(e.target.value)}
                placeholder="VD: Anh & Em 💕"
                className="w-full px-3 py-2 rounded-xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35] placeholder-[#C4A0B0]"
              />
            </div>
            <button
              onClick={handleSaveRelationship}
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-[#FF85A1] text-white font-bold text-sm"
            >
              {saving ? 'Đang lưu...' : 'Lưu 💕'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-[#FFF9F0] rounded-2xl px-3 py-2.5">
              <span className="text-sm text-[#7A5C6B]">Tên</span>
              <span className="text-sm font-semibold text-[#3D2C35]">{relationship?.couple_name ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between bg-[#FFF9F0] rounded-2xl px-3 py-2.5">
              <span className="text-sm text-[#7A5C6B]">Bắt đầu</span>
              <span className="text-sm font-semibold text-[#3D2C35]">
                {relationship?.start_date
                  ? new Date(relationship.start_date + 'T00:00:00').toLocaleDateString('vi-VN')
                  : '—'}
              </span>
            </div>
            {relationship?.start_date && (
              <div className="text-center py-2 bg-gradient-to-r from-[#FFD6E0] to-[#E8D5F5] rounded-2xl">
                <span className="text-sm font-bold text-[#FF85A1]">
                  {daysBetween(relationship.start_date).toLocaleString()} ngày bên nhau 💕
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preferences */}
      {((prefs.hobbies?.length ?? 0) > 0 || (prefs.personality?.length ?? 0) > 0) && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FFE8D6]">
          <h3 className="text-sm font-bold text-[#3D2C35] mb-4">✨ Về em</h3>
          {prefs.favoriteColor && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-[#7A5C6B]">🎨 Màu yêu thích</span>
              <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: prefs.favoriteColor }} />
            </div>
          )}
          {(prefs.hobbies?.length ?? 0) > 0 && (
            <div className="mb-3">
              <p className="text-xs text-[#C4A0B0] mb-1.5">Sở thích</p>
              <div className="flex flex-wrap gap-1.5">
                {(prefs.hobbies ?? []).map(h => (
                  <span key={h} className="px-2.5 py-1 rounded-full bg-[#FFE8D6] text-xs font-semibold text-[#7A5C6B]">{h}</span>
                ))}
              </div>
            </div>
          )}
          {(prefs.personality?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs text-[#C4A0B0] mb-1.5">Tính cách</p>
              <div className="flex flex-wrap gap-1.5">
                {(prefs.personality ?? []).map(p => (
                  <span key={p} className="px-2.5 py-1 rounded-full bg-[#E8D5F5] text-xs font-semibold text-[#7A5C6B]">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl border-2 border-[#FFD6E0] text-[#C4A0B0] font-semibold text-sm hover:bg-[#FFE8D6] transition-colors"
      >
        Đăng xuất
      </motion.button>

      <div className="text-center pb-2">
        <p className="text-xs text-[#C4A0B0]">Made with 💕</p>
      </div>
    </div>
  )
}
