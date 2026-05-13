"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateProfitPercent, calculateRR, Trade } from '@/lib/utils'
import ConfirmationModal from './ConfirmationModal'

interface TradesTableProps {
  refreshSignal?: number
}

export default function TradesTable({ refreshSignal }: TradesTableProps) {
  const supabase = createClient()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function loadTrades() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setTrades(data as any)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadTrades()
    // subscribe to changes for real‑time updates
    const channel = supabase
      .channel('trades-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trades' }, () => {
        loadTrades()
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal])

  async function handleDelete(id: string) {
    setDeleteId(id)
  }

  async function confirmDelete() {
    if (!deleteId) return
    const { error } = await supabase.from('trades').delete().eq('id', deleteId)
    if (error) {
      alert('Error deleting trade: ' + error.message)
    }
    setDeleteId(null)
  }

  return (
    <div className="mt-4 overflow-auto">
      {loading && <p>Loading trades…</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-dark-surface">
              <th className="p-2">Date</th>
              <th className="p-2">Pair</th>
              <th className="p-2">Entry</th>
              <th className="p-2">Exit</th>
              <th className="p-2">P/L %</th>
              <th className="p-2">RR</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => {
              const profit = t.exit_price
                ? calculateProfitPercent(t.entry_price, t.exit_price)
                : null
              const rr = calculateRR(t.entry_price, t.stop_loss, t.take_profit)
              return (
                <tr key={t.id} className="border-b border-dark-border">
                  <td className="p-2 text-gray-400">
                    {new Date(t.created_at as any).toLocaleDateString()}
                  </td>
                    <td className="p-2">{t.pair}</td>
                    <td className="p-2">{t.entry_price}</td>
                    <td className="p-2">{t.exit_price ?? '—'}</td>
                    <td className="p-2">
                      {profit !== null ? (
                        <span className={profit >= 0 ? 'text-dark-success' : 'text-dark-danger'}>
                          {profit.toFixed(2)}%
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-2">
                      {rr !== null ? rr.toFixed(2) : '—'}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(t.id as any)}
                        className="text-sm text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <ConfirmationModal
        open={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Trade"
        description="Are you sure you want to delete this trade? This action cannot be undone."
      />
    </div>
  )
}