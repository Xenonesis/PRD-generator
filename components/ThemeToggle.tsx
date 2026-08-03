"use client"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="bg-white dark:bg-[#2A2A2A] border border-black/20 dark:border-white/20 text-[#1A1A1A] dark:text-[#EFECE7] p-1.5 text-[10px] flex items-center justify-center opacity-50 cursor-default">
        <div className="h-3.5 w-3.5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title="Toggle Theme"
      className="bg-white dark:bg-[#2A2A2A] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black/20 dark:border-white/20 text-[#1A1A1A] dark:text-[#EFECE7] p-1.5 text-[10px] transition flex items-center justify-center"
    >
      <Sun className="h-3.5 w-3.5 hidden dark:block" />
      <Moon className="h-3.5 w-3.5 block dark:hidden" />
    </button>
  )
}
