// One shape for the form data, shared by several files.
// Later this will match the columns of your Supabase table.
export type DateResponse = {
  date: string         // like "2026-12-05" (year-month-day)
  time: string
  availability: string
  activity: string
  message: string
}