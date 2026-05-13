import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { calculateStatistics, Trade } from '@/lib/utils'
import StatsCard from '@/components/StatsCard'
import TradesTable from '@/components/TradesTable'
import EquityChart from '@/components/EquityChart'
import Navbar from '@/components/Navbar'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }
  // Fetch trades for the authenticated user
  const { data: tradesData, error } = await supabase
    .from('trades')
    .select('*')
    .order('created_at', { ascending: false })
  const trades = (tradesData as Trade[]) ?? []
  const stats = calculateStatistics(trades)
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="p-4 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard title="Total Profit" value={stats.totalProfit.toFixed(2)} color={stats.totalProfit >= 0 ? 'success' : 'danger'} />
          <StatsCard title="Win Rate" value={`${(stats.winRate * 100).toFixed(1)}%`} />
          <StatsCard title="Average RR" value={stats.avgRR.toFixed(2)} />
          <StatsCard title="Trades" value={stats.tradeCount} />
        </div>
        {/* Equity curve */}
        <div className="bg-dark-card p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Equity Curve</h2>
          {/* Client component */}
          <EquityChart trades={trades} />
        </div>
        {/* Recent trades */}
        <div className="bg-dark-card p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Recent Trades</h2>
          <TradesTable />
        </div>
      </div>
    </div>
  )
}