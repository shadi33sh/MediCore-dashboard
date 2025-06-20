'use client'
import { useEffect, useState } from 'react'

export default function ToggleModeButton() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if user previously selected a theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
