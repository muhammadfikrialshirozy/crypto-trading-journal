"use client"

import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

interface CompoundingChartProps {
  labels: string[]
  values: number[]
}

export default function CompoundingChart({ labels, values }: CompoundingChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Compounded Balance',
        data: values,
        fill: false,
        borderColor: '#00C49A',
        backgroundColor: '#00C49A',
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
  return <Line data={data} options={options as any} />
}