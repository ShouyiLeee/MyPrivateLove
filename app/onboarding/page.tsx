'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const HOBBIES = ['📚 Đọc sách', '🎵 Nghe nhạc', '🎨 Vẽ tranh', '🎮 Chơi game', '🍳 Nấu ăn', '✈️ Du lịch', '🏃 Thể thao', '🎬 Xem phim', '💻 Lập trình', '🌱 Làm vườn']
const PERSONALITIES = ['🌸 Dịu dàng', '😄 Vui vẻ', '🧠 Thông minh', '💪 Mạnh mẽ', '🎭 Hài hước', '🌙 Trầm lặng', '☀️ Năng động', '💝 Tình cảm']
const COLORS = [
  { label: 'Hồng', value: '#FFB5C8', bg: 'bg-[#FFB5C8]' },
  { label: 'Tím', value: '#D4A8F0', bg: 'bg-[#D4A8F0]' },
  { label: 'Xanh dương', value: '#A8D8F0', bg: 'bg-[#A8D8F0]' },
  { label: 'Xanh lá', value: '#A8F0C6', bg: 'bg-[#A8F0C6]' },
  { label: 'Vàng', value: '#F0E0A8', bg: 'bg-[#F0E0A8]' },
  { label: 'Cam', value: '#F0C0A8', bg: 'bg-[#F0C0A8]' },
]

interface FormData {
  nickname: string
  favoriteColor: string
  hobbies: string[]
  personality: string[]
  relationshipStart: string
  coupleName: string
}

const STEPS = ['👋 Giới thiệu', '🎨 Màu sắc', '🎯 Sở thích', '✨ Tính cách', '💕 Chúng mình']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    nickname: '',
    favoriteColor: '#FFB5C8',
    hobbies: [],
    personality: [],
    relationshipStart: '',
    coupleName: '',
  })

  function toggleArray<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
  }

  async function handleFinish() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').upsert({
      id: user.id,
      name: form.nickname || 'Bé yêu',
      preferences: {
        favoriteColor: form.favoriteColor,
        hobbies: form.hobbies,
        personality: form.personality,
        nickname: form.nickname,
      },
    })

    if (form.relationshipStart) {
      await supabase.from('relationship').upsert({
        id: 1,
        start_date: form.relationshipStart,
        couple_name: form.coupleName || 'Chúng mình',
      })
    }

    router.push('/dashboard')
  }

  const variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFD6E0] via-[#FFF9F0] to-[#E8D5F5] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex justify-between mb-6 px-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? 'bg-[#FF85A1] text-white shadow-md' : 'bg-white/60 text-[#C4A0B0]'}`}>
                {i < step ? '✓' : i + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-white/40 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] rounded-full"
            animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#FFD6E0] min-h-[360px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">👋</div>
                  <h2 className="text-xl font-bold text-[#3D2C35]">Chào mừng em đến đây!</h2>
                  <p className="text-[#7A5C6B] text-sm mt-2">Cho mình biết em tên gì nhé 🌸</p>
                </div>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                  placeholder="Biệt danh của em..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] focus:border-[#FFB5C8] transition-colors text-[#3D2C35] placeholder-[#C4A0B0] text-sm text-center text-lg font-semibold"
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🎨</div>
                  <h2 className="text-xl font-bold text-[#3D2C35]">Màu yêu thích của em?</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setForm(f => ({ ...f, favoriteColor: c.value }))}
                      className={`py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${c.bg} ${form.favoriteColor === c.value ? 'ring-3 ring-[#FF85A1] scale-105 shadow-md' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <span className="text-sm font-semibold text-white drop-shadow">{c.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🎯</div>
                  <h2 className="text-xl font-bold text-[#3D2C35]">Sở thích của em?</h2>
                  <p className="text-[#7A5C6B] text-sm mt-1">Chọn nhiều cũng được nhé</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {HOBBIES.map(h => (
                    <button
                      key={h}
                      onClick={() => setForm(f => ({ ...f, hobbies: toggleArray(f.hobbies, h) }))}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${form.hobbies.includes(h) ? 'bg-[#FF85A1] text-white scale-105' : 'bg-[#FFE8D6] text-[#3D2C35] hover:bg-[#FFD6E0]'}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">✨</div>
                  <h2 className="text-xl font-bold text-[#3D2C35]">Tính cách của em?</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PERSONALITIES.map(p => (
                    <button
                      key={p}
                      onClick={() => setForm(f => ({ ...f, personality: toggleArray(f.personality, p) }))}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${form.personality.includes(p) ? 'bg-[#D4A8F0] text-white scale-105' : 'bg-[#E8D5F5] text-[#3D2C35] hover:bg-[#D4A8F0] hover:text-white'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">💕</div>
                  <h2 className="text-xl font-bold text-[#3D2C35]">Chúng mình bắt đầu từ bao giờ?</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#3D2C35] block mb-1.5">Ngày yêu nhau</label>
                    <input
                      type="date"
                      value={form.relationshipStart}
                      onChange={e => setForm(f => ({ ...f, relationshipStart: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] focus:border-[#FFB5C8] transition-colors text-[#3D2C35] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#3D2C35] block mb-1.5">Tên của chúng mình</label>
                    <input
                      type="text"
                      value={form.coupleName}
                      onChange={e => setForm(f => ({ ...f, coupleName: e.target.value }))}
                      placeholder="VD: Anh & Em 💕"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] focus:border-[#FFB5C8] transition-colors text-[#3D2C35] placeholder-[#C4A0B0] text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          {step > 0 && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3.5 rounded-2xl border-2 border-[#FFD6E0] text-[#7A5C6B] font-semibold text-sm hover:bg-[#FFE8D6] transition-colors"
            >
              ← Quay lại
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={step < STEPS.length - 1 ? () => setStep(s => s + 1) : handleFinish}
            disabled={loading}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold text-sm shadow-md"
          >
            {loading ? '...' : step < STEPS.length - 1 ? 'Tiếp theo →' : 'Vào app 💕'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
