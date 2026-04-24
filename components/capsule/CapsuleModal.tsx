'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { TimeCapsule } from '@/types'
import { formatDateVi, toDateString } from '@/lib/helpers'

interface Props {
  userId: string
  capsule?: TimeCapsule | null   // null = create mode, set = open/view mode
  onClose: () => void
  onSaved?: (capsule: TimeCapsule) => void
  onOpened?: (capsule: TimeCapsule) => void
}

export default function CapsuleModal({ userId, capsule, onClose, onSaved, onOpened }: Props) {
  const supabase = createClient()
  const isView = !!capsule
  const canOpen = isView && !capsule.is_opened && capsule.open_date <= toDateString(new Date())

  const [message, setMessage] = useState('')
  const [openDate, setOpenDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)  // animation state

  // Min date = tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = toDateString(tomorrow)

  async function handleCreate() {
    if (!message.trim() || !openDate) return
    setSaving(true)
    const { data } = await supabase.from('time_capsules').insert({
      user_id: userId,
      message: message.trim(),
      open_date: openDate,
      is_opened: false,
    }).select().single()
    setSaving(false)
    if (data) onSaved?.(data)
    onClose()
  }

  async function handleOpen() {
    if (!capsule) return
    setOpening(true)
    // Short delay for animation
    await new Promise(r => setTimeout(r, 800))
    const { data } = await supabase
      .from('time_capsules')
      .update({ is_opened: true })
      .eq('id', capsule.id)
      .select()
      .single()
    setOpening(false)
    setOpened(true)
    if (data) onOpened?.(data)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm pb-[72px]"
        onClick={!opened ? onClose : undefined}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-white rounded-t-3xl p-6 max-h-[calc(100vh-72px)] overflow-y-auto pb-8"
          onClick={e => e.stopPropagation()}
        >
          {/* CREATE mode */}
          {!isView && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-[#3D2C35]">Viết thư cho tương lai 💌</h2>
                <button onClick={onClose} className="text-[#C4A0B0] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFE8D6]">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#3D2C35] block mb-1.5">Nội dung thư *</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Gửi em trong tương lai... Lúc đó em đang làm gì? Anh muốn em biết rằng..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35] placeholder-[#C4A0B0] resize-none leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#3D2C35] block mb-1.5">Mở vào ngày *</label>
                  <input
                    type="date"
                    value={openDate}
                    min={minDate}
                    onChange={e => setOpenDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35]"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreate}
                  disabled={saving || !message.trim() || !openDate}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Đang gửi...' : '🔒 Niêm phong thư'}
                </motion.button>
              </div>
            </>
          )}

          {/* VIEW/OPEN mode */}
          {isView && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-[#3D2C35]">
                  {capsule.is_opened || opened ? '💌 Thư của em' : '🔒 Thư niêm phong'}
                </h2>
                <button onClick={onClose} className="text-[#C4A0B0] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFE8D6]">✕</button>
              </div>

              {/* Opening animation */}
              {opening && (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl"
                  >
                    💌
                  </motion.div>
                  <p className="text-[#FF85A1] font-bold">Đang mở thư...</p>
                </motion.div>
              )}

              {/* Opened content */}
              {(capsule.is_opened || opened) && !opening && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-br from-[#FFF9F0] to-[#FFE8D6] rounded-2xl p-5 border border-[#FFD6E0]">
                    <p className="text-xs text-[#C4A0B0] mb-3">
                      Gửi từ {new Date(capsule.created_at).toLocaleDateString('vi-VN')} • Mở {formatDateVi(capsule.open_date)}
                    </p>
                    <p className="text-sm text-[#3D2C35] leading-relaxed whitespace-pre-wrap">{capsule.message}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl bg-[#FFD6E0] text-[#FF85A1] font-bold text-sm"
                  >
                    Đóng 💕
                  </button>
                </motion.div>
              )}

              {/* Locked — can open now */}
              {canOpen && !opening && !opened && (
                <motion.div className="space-y-4">
                  <div className="text-center py-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-6xl mb-3"
                    >
                      🎉
                    </motion.div>
                    <p className="text-lg font-bold text-[#FF85A1]">Đã đến ngày mở thư!</p>
                    <p className="text-sm text-[#7A5C6B] mt-1">Một thư từ quá khứ đang chờ em 💕</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleOpen}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold shadow-md text-base"
                  >
                    💌 Mở thư ngay
                  </motion.button>
                </motion.div>
              )}

              {/* Locked — not yet */}
              {!canOpen && !capsule.is_opened && !opening && !opened && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-3">🔒</div>
                  <p className="text-sm font-semibold text-[#7A5C6B]">
                    Thư sẽ được mở vào {formatDateVi(capsule.open_date)}
                  </p>
                  <p className="text-xs text-[#C4A0B0] mt-2">Còn {Math.abs(daysUntil(capsule.open_date))} ngày nữa nhé 💕</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// local import to avoid circular dependency
function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
