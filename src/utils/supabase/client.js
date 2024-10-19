import { createClient as supaCreateClient } from '@supabase/supabase-js';

export function createClient() {
    const supabase = supaCreateClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
    return supabase;
}
