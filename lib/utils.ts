/**
 * Utility functions for computing trading metrics.
 */
export interface Trade {
  id?: string
  user_id?: string
  pair: string
  entry_price: number
  exit_price: number | null
  stop_loss: number
  take_profit: number
  position_size: number
  fee?: number | null
  tax?: number | null
  screenshot_url?: string | null
  notes?: string | null
  result?: string | null
  created_at?: string
  updated_at?: string
}
}
}

/**
 * Calculates the risk–reward ratio (RR) for a trade.
 * RR = (takeProfit − entryPrice) ÷ (entryPrice − stopLoss)
 * Returns null if the denominator is zero or negative.
 */
export function calculateRR(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): number | null {
  const risk = entryPrice - stopLoss
  const reward = takeProfit - entryPrice
  if (risk <= 0) return null
  return reward / risk
}

/**
 * Calculates the percentage profit or loss for a trade.
 * If exitPrice > entryPrice it returns a positive percentage; otherwise negative.
 */
export function calculateProfitPercent(entryPrice: number, exitPrice: number): number {
  if (entryPrice === 0) return 0
  return ((exitPrice - entryPrice) / entryPrice) * 100
}

/**
 * Aggregates statistics across a list of trades.
 * Returns totalProfit (sum of profits after fees), winRate, avgRR and tradeCount.
 */
export function calculateStatistics(trades: Trade[]) {
  let totalProfit = 0
  let wins = 0
  let rrSum = 0
  let rrCount = 0
  trades.forEach((t) => {
    const profit = (t.exit_price - t.entry_price) * t.position_size - (t.fee ?? 0) - (t.tax ?? 0)
    totalProfit += profit
    if (profit > 0) wins += 1
    const rr = calculateRR(t.entry_price, t.stop_loss, t.take_profit)
    if (rr !== null) {
      rrSum += rr
      rrCount++
    }
  })
  const winRate = trades.length > 0 ? wins / trades.length : 0
  const avgRR = rrCount > 0 ? rrSum / rrCount : 0
  return {
    totalProfit,
    winRate,
    avgRR,
    tradeCount: trades.length,
  }
}
