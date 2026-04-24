export type MoodType = 'happy' | 'sad' | 'angry' | 'tired' | 'loved' | 'normal'

export const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; color: string }> = {
  happy:  { emoji: '😊', label: 'Vui',     color: '#FFD6E0' },
  loved:  { emoji: '🥰', label: 'Yêu',     color: '#FFB5C8' },
  sad:    { emoji: '😢', label: 'Buồn',    color: '#B5C8FF' },
  angry:  { emoji: '😠', label: 'Tức',     color: '#FFB5B5' },
  tired:  { emoji: '😴', label: 'Mệt',     color: '#D4D4D4' },
  normal: { emoji: '😐', label: 'Bình thường', color: '#E8D5F5' },
}

export type TagType = 'memory' | 'date' | 'normal'

export const TAG_CONFIG: Record<TagType, { emoji: string; label: string; color: string }> = {
  memory: { emoji: '💝', label: 'Kỷ niệm',  color: '#FFD6E0' },
  date:   { emoji: '💑', label: 'Hẹn hò',   color: '#E8D5F5' },
  normal: { emoji: '📝', label: 'Ngày thường', color: '#FFE8D6' },
}

export interface Profile {
  id: string
  name: string | null
  preferences: {
    favoriteColor?: string
    hobbies?: string[]
    personality?: string[]
    nickname?: string
  }
  created_at: string
}

export interface DailyEntry {
  id: string
  user_id: string
  date: string
  mood: MoodType | null
  note: string | null
  images: string[]
  tags: TagType[]
  location_lat: number | null
  location_lng: number | null
  location_name: string | null
  created_at: string
}

export interface Relationship {
  id: number
  start_date: string | null
  couple_name: string | null
}

// --- New feature types ---

export type WishlistStatus = 'want' | 'gifted' | 'owned'

export const WISHLIST_STATUS_CONFIG: Record<WishlistStatus, { emoji: string; label: string; color: string }> = {
  want:   { emoji: '💭', label: 'Muốn có',    color: '#FFF3B0' },
  gifted: { emoji: '🎁', label: 'Được tặng',  color: '#FFD6E0' },
  owned:  { emoji: '✅', label: 'Đã có',       color: '#C8F5D9' },
}

export interface WishlistItem {
  id: string
  user_id: string
  title: string
  link: string | null
  image_url: string | null
  note: string | null
  category: string | null
  status: WishlistStatus
  created_at: string
}

export interface SpecialDay {
  id: string
  user_id: string
  title: string
  date: string   // 'YYYY-MM-DD'
  note: string | null
  created_at: string
}

export interface TimeCapsule {
  id: string
  user_id: string
  message: string
  open_date: string   // 'YYYY-MM-DD'
  is_opened: boolean
  created_at: string
}
