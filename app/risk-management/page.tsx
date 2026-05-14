import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import SpotPlanner from '@/components/SpotPlanner'

export default async function RiskManagementPage() {
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
      <SpotPlanner />
    </div>
  )
}
