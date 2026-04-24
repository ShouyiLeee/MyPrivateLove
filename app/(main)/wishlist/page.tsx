'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem, WishlistStatus, WISHLIST_STATUS_CONFIG } from '@/types'
import WishlistCard from '@/components/wishlist/WishlistCard'
import WishlistModal from '@/components/wishlist/WishlistModal'

const STATUS_FILTERS: { value: WishlistStatus | 'all'; label: string }[] = [
  { value: 'all',    label: 'Tất cả' },
  { value: 'want',   label: '💭 Muốn có' },
  { value: 'gifted', label: '🎁 Được tặng' },
  { value: 'owned',  label: '✅ Đã có' },
]

export default function WishlistPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<WishlistStatus | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<WishlistItem | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setItems(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  function handleSaved(item: WishlistItem) {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      return exists ? prev.map(i => i.id === item.id ? item : i) : [item, ...prev]
    })
  }

  function handleDeleted(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3D2C35]">Wishlist 💝</h1>
          <p className="text-sm text-[#C4A0B0]">{items.length} món em thích</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { setEditItem(null); setShowModal(true) }}
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF85A1] to-[#FFB5C8] text-white text-xl flex items-center justify-center shadow-md"
        >
          +
        </motion.button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === f.value
                ? 'bg-[#FF85A1] text-white'
                : 'bg-white text-[#7A5C6B] border border-[#FFD6E0]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-4xl">💝</motion.div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-5xl">🛍️</span>
          <p className="text-[#7A5C6B] font-semibold">
            {filter === 'all' ? 'Wishlist trống' : 'Không có món nào'}
          </p>
          {filter === 'all' && (
            <p className="text-xs text-[#C4A0B0] text-center">Thêm những thứ em muốn vào đây nhé!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <WishlistCard
              key={item.id}
              item={item}
              index={i}
              onClick={() => { setEditItem(item); setShowModal(true) }}
            />
          ))}
        </div>
      )}

      {/* Stats bar */}
      {items.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl p-4 flex justify-around border border-[#FFE8D6]">
          {(['want', 'gifted', 'owned'] as WishlistStatus[]).map(s => {
            const cfg = WISHLIST_STATUS_CONFIG[s]
            const count = items.filter(i => i.status === s).length
            return (
              <div key={s} className="flex flex-col items-center gap-1">
                <span className="text-xl">{cfg.emoji}</span>
                <span className="text-lg font-extrabold text-[#3D2C35]">{count}</span>
                <span className="text-xs text-[#C4A0B0]">{cfg.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {showModal && userId && (
        <WishlistModal
          userId={userId}
          item={editItem}
          onClose={() => { setShowModal(false); setEditItem(null) }}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}
