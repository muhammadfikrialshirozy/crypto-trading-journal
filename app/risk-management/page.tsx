import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import RiskCalculator from '@/components/RiskCalculator'
import RiskSettingsForm from '@/components/RiskSettingsForm'

export default async function RiskManagementPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }
  const { data: settings } = await supabase.from('risk_settings').select('*').single()
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="p-4 space-y-6">
          <h1 className="text-2xl font-semibold">Risk Management</h1>
          <div className="bg-dark-card p-4 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-semibold">Risk Calculator</h2>
            <RiskCalculator />
          </div>
          <div className="bg-dark-card p-4 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-semibold">Risk Settings</h2>
            <RiskSettingsForm initial={settings as any} />
          </div>
      </div>
    </div>
  )
}