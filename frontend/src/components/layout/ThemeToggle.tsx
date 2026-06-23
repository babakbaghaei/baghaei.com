"use client"

import * as React from "react"
import { Moon, Sun, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"
import { useSound } from "@/lib/utils/sounds"

// Manual light/dark only — no "system" option (per design: the toggle is a
// deliberate choice between the sun and the moon, not an OS mirror).
const OPTIONS = [
  { value: "light", label: "روشن", icon: Sun },
  { value: "dark", label: "تیره", icon: Moon },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { play } = useSound()
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  // Avoid hydration mismatch — theme is unknown on the server.
  React.useEffect(() => setMounted(true), [])

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("mousedown", onClick)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("mousedown", onClick)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />
  }

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[1]
  const CurrentIcon = current.icon

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          play("pop")
          setOpen((v) => !v)
        }}
        onMouseEnter={() => play("hover")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="انتخاب حالت نمایش"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
      >
        <CurrentIcon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.8} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] as any }}
            role="menu"
            dir="rtl"
            className="absolute left-0 mt-2 w-40 origin-top-left overflow-hidden rounded-2xl border border-border bg-background p-1.5 shadow-2xl z-[120]"
          >
            {OPTIONS.map((opt) => {
              const Icon = opt.icon
              const active = theme === opt.value
              return (
                <button
                  key={opt.value}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    play("pop")
                    setTheme(opt.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-display transition-colors ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                  <span className="flex-1 text-right">{opt.label}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.5} />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
