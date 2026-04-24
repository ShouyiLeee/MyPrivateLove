'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry, MoodType, MOOD_CONFIG, SpecialDay } from '@/types'
import { getDaysInMonth, toDateString, MONTH_NAMES_VI, DAY_NAMES_VI, specialDayEmoji } from '@/lib/helpers'
import DailyEntryModal from '@/components/calendar/DailyEntryModal'
import SpecialDayCard from '@/components/special-days/SpecialDayCard'
import SpecialDayModal from '@/components/special-days/SpecialDayModal'

type CalendarTab = 'diary' | 'special'

export default function CalendarPage() {
  const router = useRouter()
  const supabase = createClient()
  const today = new Date()
  const [userId, setUserId] = useState<string | null>(null)
  const [tab, setTab] = useState<CalendarTab>('diary')
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [entries, setEntries] = useState<Map<string, DailyEntry>>(new Map())
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showSpecialModal, setShowSpecialModal] = useState(false)
  const [editSpecialDay, setEditSpecialDay] = useState<SpecialDay | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    const monthStr = String(month + 1).padStart(2, '0')
    Promise.all([
      supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('date', `${year}-${monthStr}-01`)
        .lte('date', `${year}-${monthStr}-31`),
      supabase
        .from('special_days')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true }),
    ]).then(([entriesRes, specialRes]) => {
      const map = new Map<string, DailyEntry>()
      entriesRes.data?.forEach(e => map.set(e.date, e))
      setEntries(map)
      setSpecialDays(specialRes.data ?? [])
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

  // Special days set for quick lookup on calendar
  const specialDaysSet = new Set(specialDays.map(d => d.date))

  const days = getDaysInMonth(year, month)
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const blanks = Array(firstDayOfWeek).fill(null)

  function handleSpecialSaved(day: SpecialDay) {
    setSpecialDays(prev => {
      const exists = prev.find(d => d.id === day.id)
      return exists ? prev.map(d => d.id === day.id ? day : d) : [...prev, day]
    })
  }

  function handleSpecialDeleted(id: string) {
    setSpecialDays(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-[#3D2C35]">Lịch của em</h1>
        {tab === 'special' && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setEditSpecialDay(null); setShowSpecialModal(true) }}
            className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF85A1] to-[#FFB5C8] text-white text-xl flex items-center justify-center shadow-md"
          >
            +
          </motion.button>
        )}
      </div>

      {/* Tab toggle */}
      <div className="flex bg-[#FFE8D6] rounded-2xl p-1 mb-4">
        {([['diary', '📅 Nhật ký'], ['special', '⭐ Ngày đặc biệt']] as [CalendarTab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-white text-[#FF85A1] shadow-sm' : 'text-[#7A5C6B]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Month navigator */}
      <div className="flex items-center justify-between bg-white rounded-3xl px-4 py-3 shadow-sm border border-[#FFE8D6] mb-4">
        <button onClick={prevMonth} className="text-[#FF85A1] font-bold text-lg px-2 py-1 hover:bg-[#FFE8D6] rounded-xl transition-colors">‹</button>
        <span className="font-bold text-[#3D2C35]">{MONTH_NAMES_VI[month]} {year}</span>
        <button onClick={nextMonth} className="text-[#FF85A1] font-bold text-lg px-2 py-1 hover:bg-[#FFE8D6] rounded-xl transition-colors">›</button>
      </div>

      {/* Calendar grid (always visible) */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES_VI.map(d => (
          <div key={d} className="text-center text-xs font-bold text-[#C4A0B0] py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map(day => {
          const dateStr = toDateString(day)
          const entry = entries.get(dateStr)
          const isTodayDate = dateStr === toDateString(today)
          const mood = entry?.mood as MoodType | null
          const moodCfg = mood ? MOOD_CONFIG[mood] : null
          const hasSpecial = specialDaysSet.has(dateStr)

          return (
            <motion.button
              key={dateStr}
              whileTap={{ scale: 0.9 }}
              onClick={() => tab === 'diary' && userId && setSelectedDate(dateStr)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all
                ${isTodayDate ? 'ring-2 ring-[#FF85A1]' : ''}
                ${entry || tab === 'special' ? '' : 'hover:bg-[#FFE8D6]'}
              `}
              style={{ backgroundColor: moodCfg?.color ?? (isTodayDate ? '#FFD6E0' : '#FFF9F0') }}
            >
              <span className={`text-xs font-bold ${isTodayDate ? 'text-[#FF85A1]' : 'text-[#3D2C35]'}`}>
                {day.getDate()}
              </span>
              {moodCfg && tab === 'diary' && (
                <span className="text-sm leading-none">{moodCfg.emoji}</span>
              )}
              {/* Special day indicator */}
              {hasSpecial && (
                <span className="text-[10px] leading-none">⭐</span>
              )}
              {(entry?.images?.length ?? 0) > 0 && tab === 'diary' && (
                <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#FF85A1]" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Tab content */}
      {tab === 'diary' && (
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          {Object.entries(MOOD_CONFIG).map(([mood, cfg]) => (
            <div key={mood} className="flex items-center gap-1 text-xs text-[#7A5C6B]">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.emoji} {cfg.label}
            </div>
          ))}
        </div>
      )}

      {tab === 'special' && (
        <div className="space-y-2">
          {specialDays.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-4xl">⭐</span>
              <p className="text-[#7A5C6B] font-semibold text-sm">Chưa có ngày đặc biệt nào</p>
              <p className="text-xs text-[#C4A0B0] text-center">Nhấn + để thêm sinh nhật, kỷ niệm...</p>
            </div>
          ) : (
            specialDays.map((day, i) => (
              <SpecialDayCard
                key={day.id}
                day={day}
                index={i}
                onClick={() => { setEditSpecialDay(day); setShowSpecialModal(true) }}
              />
            ))
          )}
        </div>
      )}

      {/* Daily entry modal */}
      {selectedDate && userId && tab === 'diary' && (
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

      {/* Special day modal */}
      {showSpecialModal && userId && (
        <SpecialDayModal
          userId={userId}
          day={editSpecialDay}
          onClose={() => { setShowSpecialModal(false); setEditSpecialDay(null) }}
          onSaved={handleSpecialSaved}
          onDeleted={handleSpecialDeleted}
        />
      )}
    </div>
  )
}
