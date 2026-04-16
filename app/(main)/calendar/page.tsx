'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry, MoodType, MOOD_CONFIG } from '@/types'
import { getDaysInMonth, toDateString, MONTH_NAMES_VI, DAY_NAMES_VI } from '@/lib/helpers'
import DailyEntryModal from '@/components/calendar/DailyEntryModal'

export default function CalendarPage() {
  const router = useRouter()
  const supabase = createClient()
  const today = new Date()
  const [userId, setUserId] = useState<string | null>(null)
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [entries, setEntries] = useState<Map<string, DailyEntry>>(new Map())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('date', `${year}-${String(month + 1).padStart(2, '0')}-01`)
      .lte('date', `${year}-${String(month + 1).padStart(2, '0')}-31`)
      .then(({ data }) => {
        const map = new Map<string, DailyEntry>()
        data?.forEach(e => map.set(e.date, e))
        setEntries(map)
      })
  }, [userId, year, month])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const days = getDaysInMonth(year, month)
  const firstDayOfWeek = new Date(year, month, 1).getDay()  // 0=Sun
  const blanks = Array(firstDayOfWeek).fill(null)

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#3D2C35]">Lịch của em 📅</h1>
      </div>

      {/* Month navigator */}
      <div className="flex items-center justify-between bg-white rounded-3xl px-4 py-3 shadow-sm border border-[#FFE8D6] mb-4">
        <button onClick={prevMonth} className="text-[#FF85A1] font-bold text-lg px-2 py-1 hover:bg-[#FFE8D6] rounded-xl transition-colors">‹</button>
        <span className="font-bold text-[#3D2C35]">{MONTH_NAMES_VI[month]} {year}</span>
        <button onClick={nextMonth} className="text-[#FF85A1] font-bold text-lg px-2 py-1 hover:bg-[#FFE8D6] rounded-xl transition-colors">›</button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES_VI.map(d => (
          <div key={d} className="text-center text-xs font-bold text-[#C4A0B0] py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map(day => {
          const dateStr = toDateString(day)
          const entry = entries.get(dateStr)
          const isToday = dateStr === toDateString(today)
          const mood = entry?.mood as MoodType | null
          const moodCfg = mood ? MOOD_CONFIG[mood] : null

          return (
            <motion.button
              key={dateStr}
              whileTap={{ scale: 0.9 }}
              onClick={() => userId && setSelectedDate(dateStr)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all
                ${isToday ? 'ring-2 ring-[#FF85A1]' : ''}
                ${entry ? '' : 'hover:bg-[#FFE8D6]'}
              `}
              style={{ backgroundColor: moodCfg?.color ?? (isToday ? '#FFD6E0' : '#FFF9F0') }}
            >
              <span className={`text-xs font-bold ${isToday ? 'text-[#FF85A1]' : 'text-[#3D2C35]'}`}>
                {day.getDate()}
              </span>
              {moodCfg && (
                <span className="text-sm leading-none">{moodCfg.emoji}</span>
              )}
              {(entry?.images?.length ?? 0) > 0 && (
                <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#FF85A1]" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {Object.entries(MOOD_CONFIG).map(([mood, cfg]) => (
          <div key={mood} className="flex items-center gap-1 text-xs text-[#7A5C6B]">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
            {cfg.emoji} {cfg.label}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedDate && userId && (
        <DailyEntryModal
          date={selectedDate}
          userId={userId}
          onClose={() => setSelectedDate(null)}
          onSaved={entry => {
            setEntries(map => new Map(map).set(entry.date, entry))
            setSelectedDate(null)
          }}
        />
      )}
    </div>
  )
}
