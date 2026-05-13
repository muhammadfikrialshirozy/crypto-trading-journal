"use client"

import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import { Trade } from '@/lib/utils'

// register chart.js components only once
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

interface EquityChartProps {
  trades: Trade[]
}

/**
 * Displays an equity curve chart showing cumulative P/L over time.
 */
export default function EquityChart({ trades }: EquityChartProps) {
  // Sort trades by date ascending and accumulate equity
  const sorted = [...trades].sort((a, b) => new Date(a.created_at as any).getTime() - new Date(b.created_at as any).getTime())
  let equity = 0
  const labels: string[] = []
  const dataPoints: number[] = []
  sorted.forEach((t) => {
    if (t.exit_price !== null && t.exit_price !== undefined) {
      const profit = (t.exit_price - t.entry_price) * t.position_size - (t.fee ?? 0) - (t.tax ?? 0)
      equity += profit
    }
    labels.push(new Date(t.created_at as any).toLocaleDateString())
    dataPoints.push(equity)
  })
  const data = {
    labels,
    datasets: [
      {
        label: 'Equity (cumulative profit)',
        data: dataPoints,
        fill: false,
        borderColor: '#0066FF',
        backgroundColor: '#0066FF',
      },
    ],
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y.toFixed(2)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#2A2D33',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
        grid: {
          color: '#2A2D33',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    },
  }
  return <Line data={data} options={options as any} />
}