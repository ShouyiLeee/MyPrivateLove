'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }

      // Nếu có session ngay → email confirmation đã tắt → vào onboarding
      if (data.session) {
        router.push('/onboarding')
        return
      }

      // Nếu không có session → Supabase đang chờ xác nhận email
      setSuccessMsg('Đã gửi email xác nhận! Kiểm tra hộp thư rồi click link để hoàn tất đăng ký nhé 💌')
      setLoading(false)
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Email chưa được xác nhận. Kiểm tra hộp thư và click link xác nhận nhé 📧')
        } else {
          setError('Email hoặc mật khẩu không đúng 🥺')
        }
        setLoading(false)
        return
      }

      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      router.push(profile ? '/dashboard' : '/onboarding')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFD6E0] via-[#FFF9F0] to-[#E8D5F5] px-4">
      {/* Floating hearts */}
      {['💕', '🌸', '✨', '💖', '🌷'].map((emoji, i) => (
        <motion.div
          key={i}
          className="fixed text-2xl pointer-events-none select-none"
          style={{
            left: `${10 + i * 20}%`,
            top: `${10 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        >
          {emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#FFD6E0]">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-3"
            >
              💕
            </motion.div>
            <h1 className="text-2xl font-bold text-[#3D2C35]">My Private Love</h1>
            <p className="text-[#7A5C6B] text-sm mt-1">Góc nhỏ của chúng mình 🌸</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#3D2C35] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] focus:border-[#FFB5C8] transition-colors text-[#3D2C35] placeholder-[#C4A0B0] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3D2C35] mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] focus:border-[#FFB5C8] transition-colors text-[#3D2C35] placeholder-[#C4A0B0] text-sm"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-400 bg-red-50 rounded-xl px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            {successMsg && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600 bg-green-50 rounded-xl px-3 py-2 text-center leading-relaxed"
              >
                {successMsg}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold text-sm shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
            >
              {loading ? '...' : isSignUp ? 'Tạo tài khoản 🌸' : 'Đăng nhập 💕'}
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-[#7A5C6B] mt-5">
            {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
              className="text-[#FF85A1] font-semibold hover:underline"
            >
              {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
