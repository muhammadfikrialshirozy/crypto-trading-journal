import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client configured for server‑side usage.  It reads
 * authentication cookies from the incoming request and writes them on
 * responses to persist sessions.  Use this helper inside route handlers
 * and Server Components.
 */
export function createServerClient() {
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookies().set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          // Invalidate by setting an expired cookie
          cookies().set({ name, value: '', ...options })
        },
      },
    }
  )
}