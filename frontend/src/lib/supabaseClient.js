import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ianfedrnvinptcnjnxgq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2-awLWVz6r3EFvuH3p2a8A__ZiGWkwk'

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://placeholder.supabase.co'
)

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

