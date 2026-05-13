interface StatsCardProps {
  title: string
  value: string | number
  subtext?: string
  color?: 'success' | 'danger' | 'warning' | 'default'
}

export default function StatsCard({ title, value, subtext, color = 'default' }: StatsCardProps) {
  const colorClass = (() => {
    switch (color) {
      case 'success':
        return 'text-dark-success'
      case 'danger':
        return 'text-dark-danger'
      case 'warning':
        return 'text-dark-warning'
      default:
        return 'text-white'
    }
  })()
  return (
    <div className="bg-dark-card rounded-lg p-4 shadow-md flex flex-col space-y-1">
      <span className="text-sm text-gray-400">{title}</span>
      <span className={`text-xl font-semibold ${colorClass}`}>{value}</span>
      {subtext && <span className="text-xs text-gray-500">{subtext}</span>}
    </div>
  )
}