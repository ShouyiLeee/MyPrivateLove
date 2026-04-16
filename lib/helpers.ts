import { MoodType } from '@/types'

// Format date to 'YYYY-MM-DD'
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Get all days in a month
export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

// Calculate days between two dates
export function daysBetween(start: string, end: Date = new Date()): number {
  const startDate = new Date(start)
  const diff = end.getTime() - startDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Format days into a readable string
export function formatDayCount(days: number): string {
  if (days === 0) return 'Ngày đầu tiên 🌸'
  if (days === 1) return '1 ngày'
  return `${days.toLocaleString()} ngày`
}

// Month names in Vietnamese
export const MONTH_NAMES_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

export const DAY_NAMES_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

// Format date for display
export function formatDateVi(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

// Mood stats calculator
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
