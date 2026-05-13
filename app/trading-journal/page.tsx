import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import TradeForm from '@/components/TradeForm'
import TradesTable from '@/components/TradesTable'

export default async function TradingJournalPage() {
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
        <h1 className="text-2xl font-semibold">Trading Journal</h1>
        <div className="bg-dark-card p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">New Trade</h2>
          <TradeForm />
        </div>
        <div className="bg-dark-card p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Your Trades</h2>
          <TradesTable />
        </div>
      </div>
    </div>
  )
}