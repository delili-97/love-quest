import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import PixelButton from '../components/PixelButton'
import { CONFIG } from '../config'
import { supabase } from '../lib/supabase'

// One row of the date_responses table
type Row = {
  id: string
  chosen_date: string
  chosen_time: string
  availability: string
  activity: string
  message: string | null
  created_at: string
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null) // null = logged out
  const [checking, setChecking] = useState(true)               // still checking for a saved login?
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  // On load: is someone already logged in? Then listen for login/logout changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe() // cleanup
  }, [])

  // Whenever we become logged in, load the responses (newest first)
  useEffect(() => {
    if (!session) {
      setRows([])
      return
    }
    setLoading(true)
    supabase
      .from('date_responses')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setRows(data as Row[])
        setLoading(false)
      })
  }, [session])

  async function login() {
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Login failed. Check your email and password.')
  }

  // "2026-12-05" -> "Saturday, December 5, 2026"
  function prettyDate(iso: string) {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('en', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  if (checking) return <div className="min-h-screen bg-purple-950 p-6 text-xs">Loading...</div>

  // Not logged in: show the login box
  if (!session)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-purple-950 text-center">
        <h1 className="text-lg text-pink-300">ADMIN LOGIN</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-xs bg-[#2a1a55] border-[3px] border-violet-300 p-2 text-[10px]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()} // Enter key also logs in
          className="w-full max-w-xs bg-[#2a1a55] border-[3px] border-violet-300 p-2 text-[10px]"
        />
        <div role="alert" className="min-h-5 text-xs text-red-300">{error}</div>
        <PixelButton onClick={login}>LOG IN</PixelButton>
      </div>
    )

  // Logged in: show the responses
  return (
    <div className="min-h-screen p-4 bg-purple-950 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm text-pink-300">RESPONSES ({rows.length})</h1>
        <PixelButton variant="lavender" onClick={() => supabase.auth.signOut()}>
          LOG OUT
        </PixelButton>
      </div>

      <div role="alert" className="text-xs text-red-300">{error}</div>
      {loading && <div className="text-xs">Loading...</div>}
      {!loading && rows.length === 0 && <div className="text-xs">No responses yet.</div>}

      {rows.map((r) => (
        <div key={r.id} className="pixel-box bg-[#120a24] p-4 mb-5 text-[10px] leading-loose">
          <div className="text-violet-300">
            Submitted {new Date(r.created_at).toLocaleString()}
          </div>
          <div><span className="text-pink-300">{CONFIG.labels.date}:</span> {prettyDate(r.chosen_date)}</div>
          <div><span className="text-pink-300">{CONFIG.labels.time}:</span> {r.chosen_time}</div>
          <div><span className="text-pink-300">{CONFIG.labels.availability}:</span> {r.availability}</div>
          <div><span className="text-pink-300">{CONFIG.labels.activity}:</span> {r.activity}</div>
          <div className="break-words">
            <span className="text-pink-300">MESSAGE:</span> {r.message || '(none)'}
          </div>
        </div>
      ))}
    </div>
  )
}