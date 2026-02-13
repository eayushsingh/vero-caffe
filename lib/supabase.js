
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://');

if (!isValidUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️  Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL (must be a valid URL) and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
}

export const supabase = isValidUrl
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder');
