import { supabaseClient } from './supabase-client';

// DEPRECATED: This file is kept for backward compatibility.
// Please use import { supabaseClient } from '@/lib/supabase-client' for client-side
// or import { supabaseServer } from '@/lib/supabase-server' for server-side instad.

export const supabase = supabaseClient;
