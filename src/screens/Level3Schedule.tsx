import { useState } from 'react'
import ChipGroup from '../components/ChipGroup'
import PixelButton from '../components/PixelButton'
import { CONFIG } from '../config'
import { clickSound, nopeSound, winSound } from '../lib/sound'
import type { DateResponse } from '../types'

type Props = {
  soundOn: boolean
  onSubmit: (r: DateResponse) => Promise<void> // async: the save can succeed or fail
}

// Turns a Date into "2026-12-05". Built by hand because
// toISOString() can shift the day by one in some time zones.
function toISO(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, '0') // months start at 0, so +1
  const dd = String(d.getDate()).padStart(2, '0')      // padStart adds a leading 0
  return `${d.getFullYear()}-${mm}-${dd}`
}

export default function Level3Schedule({ soundOn, onSubmit }: Props) {
  // Today at midnight, used to block past days
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  // Each form field is one piece of state (a "controlled input")
  const [month, setMonth] = useState(thisMonth) // which month the calendar shows
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [availability, setAvailability] = useState('')
  const [activity, setActivity] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')        // validation or save error
  const [saving, setSaving] = useState(false)   // true while saving

  // Work out the calendar grid for the shown month
  const y = month.getFullYear()
  const m = month.getMonth()
  const blanks = new Date(y, m, 1).getDay()           // empty cells before day 1 (0 = Sunday)
  const daysInMonth = new Date(y, m + 1, 0).getDate() // day 0 of next month = last day of this one
  const canGoBack = month.getTime() > thisMonth.getTime() // no browsing into the past

  function changeMonth(step: number) {
    if (soundOn) clickSound()
    setMonth(new Date(y, m + step, 1))
  }

  function pickDate(d: number) {
    if (soundOn) clickSound()
    setDate(toISO(new Date(y, m, d)))
  }

  async function handleSubmit() {
    if (saving) return // ignore double-clicks while saving

    // List the fields still empty. filter(Boolean) removes the false entries.
    const missing = [
      !date && 'your toughest CAT day',
      !time && 'a time',
      !availability && 'how you’re feeling',
      !activity && 'a power-up',
    ].filter(Boolean)

        if (missing.length > 0) {
      setError(`Still needed: ${missing.join(', ')}.`)
      if (soundOn) nopeSound()
      return // stop here: don't submit
    }

    setError('')
    setSaving(true)
    try {
      // Wait for App to save it. If it throws, we jump to "catch".
      await onSubmit({ date, time, availability, activity, message: message.trim() })
      if (soundOn) winSound() // only celebrate if the save worked
    } catch (err) {
      console.error('Save failed:', err)
      const detail = err instanceof Error ? err.message : JSON.stringify(err)
      setError(`Could not save: ${detail}`)
      if (soundOn) nopeSound()
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-4 text-center bg-purple-950 max-w-xl mx-auto">
      <h2 className="text-sm text-yellow-200">{CONFIG.level3Title}</h2>

      <div className="text-xs text-pink-300 self-start">{CONFIG.labels.date}</div>
      <div className="pixel-box bg-[#120a24] p-3 w-full">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => changeMonth(-1)}
            disabled={!canGoBack}
            className="bg-[#3b2470] px-3 py-2 disabled:opacity-25"
          >
            ◀
          </button>
          <span className="text-xs">
            {month.toLocaleDateString('en', { month: 'short', year: 'numeric' }).toUpperCase()}
          </span>
          <button onClick={() => changeMonth(1)} className="bg-[#3b2470] px-3 py-2">
            ▶
          </button>
        </div>

        {/* 7 equal columns: one per weekday */}
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-[8px] text-violet-300">{d}</div>
          ))}
          {/* Empty cells so day 1 lands under the right weekday */}
          {Array.from({ length: blanks }, (_, i) => <div key={`b${i}`} />)}
          {/* One button per day of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const thisDate = new Date(y, m, day)
            const isPast = thisDate < today // earlier than today = blocked
            const isSelected = toISO(thisDate) === date
            return (
              <button
                key={day}
                disabled={isPast}
                onClick={() => pickDate(day)}
                className={`py-2 text-[10px] disabled:opacity-25 disabled:cursor-not-allowed ${
                  isSelected ? 'bg-pink-500' : 'bg-[#3b2470]'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-xs text-pink-300 self-start">{CONFIG.labels.time}</div>
      <ChipGroup options={CONFIG.times} value={time} onChange={setTime} />

      <div className="text-xs text-pink-300 self-start">{CONFIG.labels.availability}</div>
      <ChipGroup options={CONFIG.availability} value={availability} onChange={setAvailability} />

      <div className="text-xs text-pink-300 self-start">{CONFIG.labels.activity}</div>
      <ChipGroup options={CONFIG.activities} value={activity} onChange={setActivity} />

      <div className="text-xs text-pink-300 self-start text-left">{CONFIG.labels.message}</div>
      <textarea
        value={message}                              // shows the state...
        onChange={(e) => setMessage(e.target.value)} // ...and updates it as you type
        maxLength={300}
        className="w-full min-h-24 bg-[#2a1a55] text-[#fff1dc] border-[3px] border-violet-300 p-2 text-[10px]"
      />

      {/* role="alert" makes screen readers announce the error */}
      <div role="alert" className="min-h-5 text-xs text-red-300">{error}</div>

      <PixelButton onClick={handleSubmit}>
        {saving ? 'SAVING...' : CONFIG.submitButton}
      </PixelButton>
    </div>
  )
}
