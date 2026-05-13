import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import StatsCard from '@/components/StatsCard'
import BarChart from '@/components/BarChart'
import CompoundingChart from '@/components/CompoundingChart'
import { calculateProfitPercent } from '@/lib/utils'

export default async function AnalyticsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }
  const { data: tradesData } = await supabase
    .from('trades')
    .select('*')
    .order('created_at', { ascending: true })
  const trades = (tradesData as AnalyticsTrade[]) ?? []
  // Win rate per pair
  const pairStats: Record<string, { wins: number; total: number }> = {}
  // Performance by day of week (0=Sun..6=Sat)
  const dayStats: number[] = Array(7).fill(0)
  // Losing streak calculation
  let losingStreak = 0
  let maxLosingStreak = 0
  // Expectancy (average profit)
  let totalProfit = 0
  // Compounding simulation
  const compLabels: string[] = []
  const compValues: number[] = []
  let capital = 1000
  trades.forEach((t) => {
    const pair = t.pair
    if (!pairStats[pair]) pairStats[pair] = { wins: 0, total: 0 }
    pairStats[pair].total += 1
    let profit = 0
    if (t.exit_price !== null && t.exit_price !== undefined) {
      profit = (t.exit_price - t.entry_price) * t.position_size - (t.fee ?? 0) - (t.tax ?? 0)
      const returnPct = calculateProfitPercent(t.entry_price, t.exit_price) / 100
      capital *= 1 + returnPct
    }
    totalProfit += profit
    if (profit > 0) {
      pairStats[pair].wins += 1
      losingStreak = 0
    } else {
      losingStreak += 1
      if (losingStreak > maxLosingStreak) maxLosingStreak = losingStreak
    }
    // day of week stats
    const day = new Date(t.created_at as any).getDay()
    dayStats[day] += profit
    compLabels.push(new Date(t.created_at as any).toLocaleDateString())
    compValues.push(capital)
  })
  const expectancy = trades.length > 0 ? totalProfit / trades.length : 0
  // compute pair labels and win rates
  const pairLabels = Object.keys(pairStats)
  const pairWinRates = pairLabels.map((p) => {
    const s = pairStats[p]
    return s.total > 0 ? (s.wins / s.total) * 100 : 0
  })
  // identify best pair (highest win rate)
  let bestPair = ''
  let bestWinRate = 0
  pairLabels.forEach((p, i) => {
    if (pairWinRates[i] > bestWinRate) {
      bestWinRate = pairWinRates[i]
      bestPair = p
    }
  })
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="Expectancy" value={expectancy.toFixed(2)} />
          <StatsCard title="Max Losing Streak" value={maxLosingStreak} />
          <StatsCard title="Best Pair" value={bestPair || '—'} />
          <StatsCard title="Win Rate (Best)" value={`${bestWinRate.toFixed(1)}%`} />
        </div>
        {/* Win rate per pair */}
        <div className="bg-dark-card p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Win Rate per Pair</h2>
          {pairLabels.length > 0 ? (
            <BarChart labels={pairLabels} values={pairWinRates} />
          ) : (
            <p className="text-gray-500 text-sm">No data available.</p>
          )}
        </div>
        {/* Performance by day of week */}
        <div className="bg-dark-card p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Profit by Day of Week</h2>
          <BarChart labels={dayNames} values={dayStats} />
        </div>
        {/* Compounding simulation */}
        <div className="bg-dark-card p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Compounding Simulation (Starting $1,000)</h2>
          <CompoundingChart labels={compLabels} values={compValues} />
        </div>
      </div>
    </div>
  )
}type AnalyticsTrade = {
  id?: string
  pair: string
  entry_price: number
  exit_price: number | null
  stop_loss: number
  take_profit: number
  position_size: number
  fee?: number | null
  tax?: number | null
  created_at?: string
}
