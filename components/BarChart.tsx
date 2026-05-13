"use client"

import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface BarChartProps {
  labels: string[]
  values: number[]
  title?: string
}

export default function BarChart({ labels, values, title }: BarChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: title ?? '',
        data: values,
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
  return <Bar data={data} options={options as any} />
}