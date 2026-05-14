'use client'

import { useMemo, useState } from 'react'

function formatIDR(value: number) {
  if (!Number.isFinite(value)) return 'Rp0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCoin(value: number) {
  if (!Number.isFinite(value)) return '0'

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 10,
  }).format(value)
}

export default function SpotPlanner() {
  const [availableCapital, setAvailableCapital] = useState('')
  const [coin, setCoin] = useState('BTC')
  const [buyPrice, setBuyPrice] = useState('')
  const [allocationAmount, setAllocationAmount] = useState('')
  const [feeTaxPercent, setFeeTaxPercent] = useState('0.4')
  const [maxAllocationPercent, setMaxAllocationPercent] = useState('50')

  const result = useMemo(() => {
    const capital = Number(availableCapital)
    const price = Number(buyPrice)
    const allocation = Number(allocationAmount)
    const feeTax = Number(feeTaxPercent)
    const maxAllocation = Number(maxAllocationPercent)

    const isValid =
      capital > 0 &&
      price > 0 &&
      allocation > 0 &&
      feeTax >= 0 &&
      maxAllocation > 0

    if (!isValid) return null

    const estimatedFeeTax = allocation * (feeTax / 100)
    const netAllocation = allocation - estimatedFeeTax
    const estimatedQuantity = netAllocation / price
    const remainingCapital = capital - allocation
    const allocationPercent = (allocation / capital) * 100
    const isOverAllocated = allocationPercent > maxAllocation

    return {
      estimatedFeeTax,
      estimatedQuantity,
      remainingCapital,
      allocationPercent,
      isOverAllocated,
      maxAllocation,
    }
  }, [
    availableCapital,
    buyPrice,
    allocationAmount,
    feeTaxPercent,
    maxAllocationPercent,
  ])

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Spot Planner</h1>
        <p className="text-sm text-gray-400 mt-1">
          Hitung estimasi pembelian spot sebelum entry. Fokusnya bukan leverage,
          tapi alokasi modal yang masuk akal.
        </p>
      </div>

      <section className="bg-dark-card rounded-lg shadow-md p-4 md:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Buy Allocation Calculator</h2>
          <p className="text-sm text-gray-400 mt-1">
            Gunakan ini sebelum beli coin spot agar kamu tahu estimasi jumlah
            coin, biaya fee/pajak, dan sisa modal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm text-gray-300">Available Capital</span>
            <input
              type="number"
              value={availableCapital}
              onChange={(e) => setAvailableCapital(e.target.value)}
              placeholder="Contoh: 100000"
              className="w-full rounded-md bg-dark-bg border border-gray-700 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-300">Coin</span>
            <input
              type="text"
              value={coin}
              onChange={(e) => setCoin(e.target.value.toUpperCase())}
              placeholder="BTC / ETH / SOL"
              className="w-full rounded-md bg-dark-bg border border-gray-700 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-300">Buy Price</span>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="Contoh: 1000000000"
              className="w-full rounded-md bg-dark-bg border border-gray-700 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-300">Allocation Amount</span>
            <input
              type="number"
              value={allocationAmount}
              onChange={(e) => setAllocationAmount(e.target.value)}
              placeholder="Contoh: 20000"
              className="w-full rounded-md bg-dark-bg border border-gray-700 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-300">Fee + Tax (%)</span>
            <input
              type="number"
              value={feeTaxPercent}
              onChange={(e) => setFeeTaxPercent(e.target.value)}
              placeholder="Contoh: 0.4"
              className="w-full rounded-md bg-dark-bg border border-gray-700 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-300">
              Max Allocation per Coin (%)
            </span>
            <input
              type="number"
              value={maxAllocationPercent}
              onChange={(e) => setMaxAllocationPercent(e.target.value)}
              placeholder="Contoh: 50"
              className="w-full rounded-md bg-dark-bg border border-gray-700 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>
        </div>
      </section>

      <section className="bg-dark-card rounded-lg shadow-md p-4 md:p-6 space-y-4">
        <h2 className="text-lg font-semibold">Result</h2>

        {!result ? (
          <div className="rounded-md border border-gray-700 bg-dark-bg p-4">
            <p className="text-sm text-gray-400">
              Isi available capital, buy price, dan allocation amount untuk
              menghitung estimasi pembelian spot.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-md border border-gray-700 bg-dark-bg p-4">
                <p className="text-sm text-gray-400">Estimated Quantity</p>
                <p className="text-xl font-semibold mt-1">
                  {formatCoin(result.estimatedQuantity)} {coin || 'COIN'}
                </p>
              </div>

              <div className="rounded-md border border-gray-700 bg-dark-bg p-4">
                <p className="text-sm text-gray-400">Estimated Fee + Tax</p>
                <p className="text-xl font-semibold mt-1">
                  {formatIDR(result.estimatedFeeTax)}
                </p>
              </div>

              <div className="rounded-md border border-gray-700 bg-dark-bg p-4">
                <p className="text-sm text-gray-400">Remaining Capital</p>
                <p className="text-xl font-semibold mt-1">
                  {formatIDR(result.remainingCapital)}
                </p>
              </div>

              <div className="rounded-md border border-gray-700 bg-dark-bg p-4">
                <p className="text-sm text-gray-400">Allocation</p>
                <p className="text-xl font-semibold mt-1">
                  {result.allocationPercent.toFixed(2)}%
                </p>
              </div>
            </div>

            {result.isOverAllocated ? (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4">
                <p className="text-sm text-red-300 font-medium">
                  Warning: alokasi ini terlalu besar.
                </p>
                <p className="text-sm text-red-200 mt-1">
                  Kamu memakai {result.allocationPercent.toFixed(2)}% dari
                  modal, sedangkan batas maksimal yang kamu set adalah{' '}
                  {result.maxAllocation.toFixed(2)}%.
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-300 font-medium">
                  Allocation looks safe.
                </p>
                <p className="text-sm text-emerald-200 mt-1">
                  Alokasi masih di bawah batas maksimal yang kamu tentukan.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <section className="bg-dark-card rounded-lg shadow-md p-4 md:p-6 space-y-3">
        <h2 className="text-lg font-semibold">Spot Trading Notes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div className="rounded-md border border-gray-700 bg-dark-bg p-4">
            <p className="font-medium text-white">No leverage</p>
            <p className="mt-1 text-gray-400">
              Spot trading tidak perlu mikir liquidation seperti futures. Fokus
              ke harga beli, alokasi, dan kesabaran.
            </p>
          </div>

          <div className="rounded-md border border-gray-700 bg-dark-bg p-4">
            <p className="font-medium text-white">Allocation first</p>
            <p className="mt-1 text-gray-400">
              Jangan all-in satu coin. Bagi modal supaya kamu masih punya ruang
              kalau market turun.
            </p>
          </div>

          <div className="rounded-md border border-gray-700 bg-dark-bg p-4">
            <p className="font-medium text-white">Fee matters</p>
            <p className="mt-1 text-gray-400">
              Fee dan pajak tetap memotong hasil. Masukkan estimasi biaya agar
              perhitungan lebih realistis.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
