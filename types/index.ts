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
  date: string           // ISO date string 'YYYY-MM-DD'
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
  start_date: string | null  // 'YYYY-MM-DD'
  couple_name: string | null
}
