"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/trading-journal', label: 'Trading Journal' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/risk-management', label: 'Spot Planner' },
  { href: '/settings', label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden sm:flex flex-col w-56 bg-dark-surface border-r border-dark-border p-4">
      <h1 className="text-xl font-semibold mb-6">Trading Journal</h1>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-dark-card text-white'
                  : 'text-gray-400 hover:bg-dark-card hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
