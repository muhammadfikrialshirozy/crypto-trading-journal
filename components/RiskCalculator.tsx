"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RiskCalculator() {
  const supabase = createClient()
  const [balance, setBalance] = useState('')
  const [riskPercent, setRiskPercent] = useState('1')
  const [entryPrice, setEntryPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [positionSize, setPositionSize] = useState<number | null>(null)
  const [maxRisk, setMaxRisk] = useState<number | null>(null)

  useEffect(() => {
    // Load user risk settings
    async function loadSettings() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data, error } = await supabase.from('risk_settings').select('*').single()
      if (!error && data) {
        setRiskPercent(String((data.max_risk_per_trade ?? 0.01) * 100))
      }
    }
    loadSettings()
  }, [supabase])

  function calculate() {
    const bal = parseFloat(balance)
    const risk = parseFloat(riskPercent) / 100
    const entry = parseFloat(entryPrice)
    const sl = parseFloat(stopLoss)
    if (!bal || !risk || !entry || !sl) {
      setPositionSize(null)
      setMaxRisk(null)
      return
    }
    const riskAmount = bal * risk
    const diff = Math.abs(entry - sl)
    if (diff === 0) {
      setPositionSize(null)
      setMaxRisk(null)
      return
    }
    const size = riskAmount / diff
    setPositionSize(size)
    setMaxRisk(riskAmount)
  }

  useEffect(() => {
    calculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, riskPercent, entryPrice, stopLoss])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Account Balance</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Risk per Trade (%)</label>
          <input
            type="number"
            value={riskPercent}
            step="any"
            onChange={(e) => setRiskPercent(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Entry Price</label>
          <input
            type="number"
            value={entryPrice}
            step="any"
            onChange={(e) => setEntryPrice(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Stop Loss Price</label>
          <input
            type="number"
            value={stopLoss}
            step="any"
            onChange={(e) => setStopLoss(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
      </div>
      <div className="bg-dark-card p-4 rounded-md">
        <h3 className="font-semibold mb-2">Result</h3>
        {positionSize !== null ? (
          <div className="space-y-1">
            <p>Max risk amount: <span className="text-dark-warning">{maxRisk?.toFixed(2)}</span></p>
            <p>Recommended position size: <span className="text-dark-success">{positionSize.toFixed(4)}</span> units</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Fill in all fields to calculate position size.</p>
        )}
      </div>
    </div>
  )
}