"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      // After sign up, Supabase may send verification email; still route to dashboard
      router.push('/dashboard')
    }
    setLoading(false)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-background">
      <div className="bg-dark-card p-6 rounded-lg shadow-md w-80 space-y-4">
        <h1 className="text-xl font-semibold">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-white"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-dark-accent hover:bg-dark-accentHover rounded-md text-white"
          >
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>
        <p className="text-xs text-gray-500">
          Already have an account?{' '}
          <a href="/auth/login" className="text-dark-accent hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}