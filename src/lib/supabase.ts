import { createClient } from '@supabase/supabase-js'

// import.meta.env reads the values from .env.local
const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// One shared connection to your database
export const supabase = createClient(url, key)
console.log('key starts with:', key?.slice(0, 15), 'length:', key?.length)