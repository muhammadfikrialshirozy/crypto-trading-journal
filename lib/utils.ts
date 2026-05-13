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

/**
 * Calculates the risk–reward ratio (RR) for a trade.
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
 */
export function calculateProfitPercent(
  entryPrice: number,
  exitPrice: number
): number {
  if (entryPrice === 0) return 0

  return ((exitPrice - entryPrice) / entryPrice) * 100
}

/**
 * Aggregates statistics across a list of trades.
 */
export function calculateStatistics(trades: Trade[]) {
  let totalProfit = 0
  let wins = 0
  let rrSum = 0
  let rrCount = 0
  let closedTrades = 0

  trades.forEach((trade) => {
    const rr = calculateRR(
      trade.entry_price,
      trade.stop_loss,
      trade.take_profit
    )

    if (rr !== null) {
      rrSum += rr
      rrCount += 1
    }

    if (trade.exit_price === null || trade.exit_price === undefined) {
      return
    }

    closedTrades += 1

    const fee = trade.fee ?? 0
    const tax = trade.tax ?? 0

    const profit =
      (trade.exit_price - trade.entry_price) * trade.position_size - fee - tax

    totalProfit += profit

    if (profit > 0) {
      wins += 1
    }
  })

  return {
    totalProfit,
    winRate: closedTrades > 0 ? wins / closedTrades : 0,
    avgRR: rrCount > 0 ? rrSum / rrCount : 0,
    tradeCount: trades.length,
  }
}
