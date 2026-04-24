'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { SpecialDay } from '@/types'

interface Props {
  userId: string
  day?: SpecialDay | null
  onClose: () => void
  onSaved: (day: SpecialDay) => void
  onDeleted?: (id: string) => void
}

export default function SpecialDayModal({ userId, day, onClose, onSaved, onDeleted }: Props) {
  const supabase = createClient()
  const isEdit = !!day

  const [title, setTitle] = useState(day?.title ?? '')
  const [date, setDate] = useState(day?.date ?? '')
  const [note, setNote] = useState(day?.note ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave() {
    if (!title.trim() || !date) return
    setSaving(true)
    const payload = { user_id: userId, title: title.trim(), date, note: note.trim() || null }
    let result
    if (isEdit && day) {
      result = await supabase.from('special_days').update(payload).eq('id', day.id).select().single()
    } else {
      result = await supabase.from('special_days').insert(payload).select().single()
    }
    setSaving(false)
    if (result.data) onSaved(result.data)
    onClose()
  }

  async function handleDelete() {
    if (!day) return
    setDeleting(true)
    await supabase.from('special_days').delete().eq('id', day.id)
    onDeleted?.(day.id)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm pb-[72px]"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#3D2C35]">
              {isEdit ? 'Chỉnh sửa ngày đặc biệt ⭐' : 'Thêm ngày đặc biệt ⭐'}
            </h2>
            <button onClick={onClose} className="text-[#C4A0B0] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFE8D6]">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#3D2C35] block mb-1.5">Tên ngày *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="VD: Sinh nhật em, Kỷ niệm 1 năm..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35] placeholder-[#C4A0B0]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#3D2C35] block mb-1.5">Ngày *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#3D2C35] block mb-1.5">Ghi chú</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ghi chú thêm..."
                rows={2}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35] placeholder-[#C4A0B0] resize-none"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving || !title.trim() || !date}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold shadow-md disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : isEdit ? '💾 Cập nhật' : '⭐ Thêm ngày đặc biệt'}
            </motion.button>

            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-3 rounded-2xl border-2 border-red-100 text-red-400 text-sm font-semibold hover:bg-red-50"
              >
                {deleting ? 'Đang xóa...' : '🗑️ Xóa ngày này'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
