'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem, WishlistStatus } from '@/types'

interface Props {
  userId: string
  item?: WishlistItem | null
  onClose: () => void
  onSaved: (item: WishlistItem) => void
  onDeleted?: (id: string) => void
}

export default function WishlistModal({ userId, item, onClose, onSaved, onDeleted }: Props) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = !!item

  const [title, setTitle] = useState(item?.title ?? '')
  const [link, setLink] = useState(item?.link ?? '')
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '')
  const [note, setNote] = useState(item?.note ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [status, setStatus] = useState<WishlistStatus>(item?.status ?? 'want')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('wishlist-images').upload(path, file)
    if (error) {
      setUploadError('Upload ảnh thất bại. Kiểm tra bucket wishlist-images trong Supabase.')
    } else if (data) {
      const { data: urlData } = supabase.storage.from('wishlist-images').getPublicUrl(data.path)
      setImageUrl(urlData.publicUrl)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    const payload = {
      user_id: userId,
      title: title.trim(),
      link: link.trim() || null,
      image_url: imageUrl.trim() || null,
      note: note.trim() || null,
      category: category.trim() || null,
      status,
    }
    let result
    if (isEdit && item) {
      result = await supabase.from('wishlist_items').update(payload).eq('id', item.id).select().single()
    } else {
      result = await supabase.from('wishlist_items').insert(payload).select().single()
    }
    setSaving(false)
    if (result.data) onSaved(result.data)
    onClose()
  }

  async function handleDelete() {
    if (!item) return
    setDeleting(true)
    await supabase.from('wishlist_items').delete().eq('id', item.id)
    onDeleted?.(item.id)
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
          className="w-full max-w-lg bg-white rounded-t-3xl p-6 max-h-[calc(100vh-72px)] overflow-y-auto pb-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#3D2C35]">
              {isEdit ? 'Chỉnh sửa 💝' : 'Thêm vào wishlist 💝'}
            </h2>
            <button onClick={onClose} className="text-[#C4A0B0] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFE8D6]">✕</button>
          </div>

          <div className="space-y-4">
            {/* Image preview */}
            <div
              className="w-full h-40 rounded-2xl bg-[#FFF9F0] border-2 border-dashed border-[#FFD6E0] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <>
                  <span className="text-3xl mb-1">{uploading ? '⏳' : '📷'}</span>
                  <span className="text-xs text-[#C4A0B0]">{uploading ? 'Đang tải...' : 'Tap để upload ảnh'}</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

            {uploadError && (
              <p className="text-xs text-red-400 bg-red-50 rounded-xl px-3 py-2">{uploadError}</p>
            )}

            {/* Image URL alternative */}
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="Hoặc paste URL ảnh..."
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35] placeholder-[#C4A0B0]"
            />

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-[#3D2C35] block mb-1.5">Tên sản phẩm *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="VD: Áo khoác hồng cute..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35] placeholder-[#C4A0B0]"
              />
            </div>

            {/* Link */}
            <div>
              <label className="text-xs font-bold text-[#3D2C35] block mb-1.5">Link sản phẩm</label>
              <input
                type="url"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://shopee.vn/..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35] placeholder-[#C4A0B0]"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-bold text-[#3D2C35] block mb-1.5">Ghi chú</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Tại sao em thích cái này?..."
                rows={2}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFD6E0] bg-[#FFF9F0] text-sm text-[#3D2C35] placeholder-[#C4A0B0] resize-none"
              />
            </div>

            {/* Save */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFB5C8] text-white font-bold shadow-md disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : isEdit ? '💾 Cập nhật' : '💝 Thêm vào wishlist'}
            </motion.button>

            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-3 rounded-2xl border-2 border-red-100 text-red-400 text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                {deleting ? 'Đang xóa...' : '🗑️ Xóa khỏi wishlist'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
