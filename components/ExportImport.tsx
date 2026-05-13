"use client"

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ExportImport() {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleExport() {
    setMessage(null)
    const { data, error } = await supabase.from('trades').select('*')
    if (error) {
      setMessage('Export error: ' + error.message)
      return
    }
    const trades = data ?? []
    const header = [
      'pair',
      'entry_price',
      'exit_price',
      'stop_loss',
      'take_profit',
      'position_size',
      'fee',
      'tax',
      'notes',
      'created_at',
    ]
    const rows = trades.map((t: any) => {
      return header
        .map((key) => {
          const value = t[key] ?? ''
          return String(value).replace(/"/g, '""')
        })
        .join(',')
    })
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'trades_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setMessage(null)
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(Boolean)
    const header = lines[0].split(',')
    const rows = lines.slice(1)
    const trades = rows.map((row) => {
      const cols = row.split(',')
      const obj: any = {}
      header.forEach((key, idx) => {
        obj[key] = cols[idx] === '' ? null : cols[idx]
      })
      // Convert numeric fields
      obj.entry_price = parseFloat(obj.entry_price)
      obj.exit_price = obj.exit_price ? parseFloat(obj.exit_price) : null
      obj.stop_loss = parseFloat(obj.stop_loss)
      obj.take_profit = parseFloat(obj.take_profit)
      obj.position_size = parseFloat(obj.position_size)
      obj.fee = obj.fee ? parseFloat(obj.fee) : null
      obj.tax = obj.tax ? parseFloat(obj.tax) : null
      return obj
    })
    try {
      const { error } = await supabase.from('trades').insert(trades)
      if (error) throw error
      setMessage(`Imported ${trades.length} trades successfully.`)
    } catch (err: any) {
      setMessage('Import error: ' + err.message)
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-dark-accent hover:bg-dark-accentHover rounded-md text-white"
        >
          Export Journal
        </button>
        <label className="px-4 py-2 bg-dark-border rounded-md text-white cursor-pointer">
          Import CSV
          <input
            type="file"
            accept="text/csv"
            ref={fileRef}
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  )
}