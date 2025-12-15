import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    console.error('Missing Supabase environment variables!');
}

// Browser client
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

// Server-side client (for API routes)
export function createServerSupabaseClient() {
    return createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
        auth: {
            persistSession: false,
        },
    });
}
