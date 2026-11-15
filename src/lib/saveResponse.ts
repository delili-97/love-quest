import { supabase } from './supabase'
import type { DateResponse } from '../types'

export async function saveResponse(r: DateResponse) {
  // .insert() adds one row. Left names = database columns, right = form values.
  const { error } = await supabase.from('date_responses').insert({
    chosen_date: r.date,
    chosen_time: r.time,
    availability: r.availability,
    activity: r.activity,
    message: r.message || null, // an empty message is stored as null
  })
  // No .select() here: visitors may not read rows, so asking for the saved
  // row back would fail under our security rules.
  if (error) throw error // pass the problem up so the form can show it
}