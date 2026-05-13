"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RiskSettings {
  max_risk_per_trade: number
  daily_loss_limit: number
  max_trades_per_day: number
}

interface RiskSettingsFormProps {
  initial?: RiskSettings
}

export default function RiskSettingsForm({ initial }: RiskSettingsFormProps) {
  const supabase = createClient()
  const [maxRisk, setMaxRisk] = useState(initial?.max_risk_per_trade ?? 0.01)
  const [dailyLoss, setDailyLoss] = useState(initial?.daily_loss_limit ?? 0.05)
  const [maxTrades, setMaxTrades] = useState(initial?.max_trades_per_day ?? 5)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    try {
      const { error } = await supabase.from('risk_settings').upsert(
        {
          max_risk_per_trade: maxRisk,
          daily_loss_limit: dailyLoss,
          max_trades_per_day: maxTrades,
        },
        { onConflict: 'user_id' }
      )
      if (error) {
        throw error
      }
      setMessage('Saved successfully')
    } catch (err: any) {
      setMessage('Error: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Max Risk per Trade</label>
          <input
            type="number"
            value={maxRisk}
            step="0.001"
            min="0"
            max="1"
            onChange={(e) => setMaxRisk(parseFloat(e.target.value))}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Daily Loss Limit</label>
          <input
            type="number"
            value={dailyLoss}
            step="0.001"
            min="0"
            max="1"
            onChange={(e) => setDailyLoss(parseFloat(e.target.value))}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Max Trades per Day</label>
          <input
            type="number"
            value={maxTrades}
            min="1"
            onChange={(e) => setMaxTrades(parseInt(e.target.value, 10))}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
      </div>
      {message && <p className="text-sm text-gray-400">{message}</p>}
      <button type="submit" className="px-4 py-2 bg-dark-accent hover:bg-dark-accentHover rounded-md text-white">
        Save Settings
      </button>
    </form>
  )
}