import { createBrowserClient } from '@supabase/ssr'

/**
 * Returns a browser Supabase client.  The client uses the publishable
 * key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) and is safe to use on the client side.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}