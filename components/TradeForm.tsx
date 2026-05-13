"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateRR, calculateProfitPercent } from '@/lib/utils'

interface TradeFormProps {
  onSaved?: () => void
}

export default function TradeForm({ onSaved }: TradeFormProps) {
  const supabase = createClient()
  const [pair, setPair] = useState('')
  const [entryPrice, setEntryPrice] = useState('')
  const [exitPrice, setExitPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [positionSize, setPositionSize] = useState('')
  const [fee, setFee] = useState('')
  const [tax, setTax] = useState('')
  const [notes, setNotes] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let screenshotUrl: string | null = null
      if (screenshot) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('screenshots')
          .upload(
            `${Date.now()}-${screenshot.name}`,
            screenshot,
            {
              cacheControl: '3600',
              upsert: false,
            }
          )
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('screenshots')
          .getPublicUrl(uploadData.path)
        screenshotUrl = urlData.publicUrl
      }
      const entry = parseFloat(entryPrice)
      const exit = exitPrice ? parseFloat(exitPrice) : null
      const stop = parseFloat(stopLoss)
      const tp = parseFloat(takeProfit)
      const size = parseFloat(positionSize)
      const feeNum = fee ? parseFloat(fee) : null
      const taxNum = tax ? parseFloat(tax) : null
      const rr = calculateRR(entry, stop, tp)
      const profitPercent = exit !== null ? calculateProfitPercent(entry, exit) : null
      const { error: insertError } = await supabase.from('trades').insert({
        pair,
        entry_price: entry,
        exit_price: exit,
        stop_loss: stop,
        take_profit: tp,
        position_size: size,
        fee: feeNum,
        tax: taxNum,
        notes,
        screenshot_url: screenshotUrl,
        result: profitPercent !== null ? `${profitPercent.toFixed(2)}%` : null,
      })
      if (insertError) throw insertError
      // clear form
      setPair('')
      setEntryPrice('')
      setExitPrice('')
      setStopLoss('')
      setTakeProfit('')
      setPositionSize('')
      setFee('')
      setTax('')
      setNotes('')
      setScreenshot(null)
      if (onSaved) onSaved()
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Pair</label>
          <input
            type="text"
            value={pair}
            onChange={(e) => setPair(e.target.value.toUpperCase())}
            required
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Entry Price</label>
          <input
            type="number"
            step="any"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            required
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Exit Price</label>
          <input
            type="number"
            step="any"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
            placeholder="Leave empty if trade still open"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Stop Loss</label>
          <input
            type="number"
            step="any"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            required
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Take Profit</label>
          <input
            type="number"
            step="any"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            required
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Position Size</label>
          <input
            type="number"
            step="any"
            value={positionSize}
            onChange={(e) => setPositionSize(e.target.value)}
            required
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Fee</label>
          <input
            type="number"
            step="any"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Tax</label>
          <input
            type="number"
            step="any"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Screenshot (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-400 file:bg-dark-card file:border file:border-dark-border file:px-3 file:py-1 file:rounded-md file:text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-dark-card border border-dark-border rounded-md p-2 text-sm text-white"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-dark-accent hover:bg-dark-accentHover rounded-md text-white disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Trade'}
      </button>
    </form>
  )
}