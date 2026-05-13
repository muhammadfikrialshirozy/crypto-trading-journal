import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ThemeToggle from '@/components/ThemeToggle'
import ExportImport from '@/components/ExportImport'

export default async function SettingsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="bg-dark-card p-4 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <ThemeToggle />
        </div>
        <div className="bg-dark-card p-4 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Data Management</h2>
          <ExportImport />
        </div>
      </div>
    </div>
  )
}