"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SupabaseUser {
  id: string
  email?: string
}

export default function Navbar() {
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      if (mounted) setUser(data.user ?? null)
    }
    loadUser()
    return () => {
      mounted = false
    }
  }, [supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    // Hard redirect to login page (client route) after signout
    window.location.href = '/auth/login'
  }

  return (
    <header className="w-full flex justify-end items-center p-4 border-b border-dark-border bg-dark-surface text-gray-200">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="px-3 py-1 text-sm bg-dark-card hover:bg-dark-border rounded-md"
          >
            Sign Out
          </button>
        </div>
      ) : null}
    </header>
  )
}