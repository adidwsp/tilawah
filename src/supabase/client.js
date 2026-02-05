import { createClient } from '@supabase/supabase-js'

// Pakai import.meta.env (Vite), BUKAN process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl) // Debug

// Buat supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)