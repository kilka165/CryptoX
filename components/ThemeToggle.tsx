"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ждем пока компонент смонтируется на клиенте
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" /> // Заглушка, чтобы не прыгало
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors relative"
      aria-label="Переключить тему"
    >
      {theme === 'dark' ? (
        <Moon size={20} className="text-blue-400" />
      ) : (
        <Sun size={20} className="text-orange-500" />
      )}
    </button>
  )
}
