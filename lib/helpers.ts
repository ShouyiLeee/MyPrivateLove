import { MoodType } from '@/types'

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function daysBetween(start: string, end: Date = new Date()): number {
  const startDate = new Date(start)
  const diff = end.getTime() - startDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Days remaining until a future date (negative if past)
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function isToday(dateStr: string): boolean {
  return dateStr === toDateString(new Date())
}

export function formatDayCount(days: number): string {
  if (days === 0) return 'Ngày đầu tiên 🌸'
  if (days === 1) return '1 ngày'
  return `${days.toLocaleString()} ngày`
}

export const MONTH_NAMES_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

export const DAY_NAMES_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export function formatDateVi(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export function calcMoodStats(entries: { mood: MoodType | null }[]) {
  const moods = entries.filter(e => e.mood).map(e => e.mood as MoodType)
  const total = moods.length
  if (total === 0) return {}
  const counts: Partial<Record<MoodType, number>> = {}
  for (const mood of moods) {
    counts[mood] = (counts[mood] ?? 0) + 1
  }
  const pct: Partial<Record<MoodType, number>> = {}
  for (const [mood, count] of Object.entries(counts)) {
    pct[mood as MoodType] = Math.round((count / total) * 100)
  }
  return pct
}

// Compress image using Canvas before upload (max 1200px wide, quality 0.82, output JPEG)
export async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('canvas context unavailable')); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob failed')), 'image/jpeg', quality)
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('image load failed')) }
    img.src = objectUrl
  })
}

// Auto-detect emoji for special day title
export function specialDayEmoji(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('sinh nhật') || t.includes('birthday')) return '🎂'
  if (t.includes('kỷ niệm') || t.includes('anniversary')) return '💍'
  if (t.includes('du lịch') || t.includes('travel') || t.includes('trip')) return '✈️'
  if (t.includes('valentine') || t.includes('tình nhân')) return '💕'
  if (t.includes('tết') || t.includes('new year')) return '🎆'
  if (t.includes('giáng sinh') || t.includes('christmas')) return '🎄'
  return '⭐'
}
