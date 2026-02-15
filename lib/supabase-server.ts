import { createClient } from "@supabase/supabase-js"

// Use service role key for server-side operations to bypass RLS
// Falls back to anon key if service role is not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseServer = createClient(supabaseUrl, supabaseKey)
