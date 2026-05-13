"use client"

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    // Load saved theme preference
    const stored = localStorage.getItem('theme')
    if (stored) {
      setDark(stored === 'dark')
      document.documentElement.classList.toggle('dark', stored === 'dark')
    }
  }, [])

  function toggle() {
    const newDark = !dark
    setDark(newDark)
    const value = newDark ? 'dark' : 'light'
    localStorage.setItem('theme', value)
    document.documentElement.classList.toggle('dark', newDark)
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 bg-dark-border rounded-md text-sm hover:bg-dark-surface"
    >
      {dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  )
}