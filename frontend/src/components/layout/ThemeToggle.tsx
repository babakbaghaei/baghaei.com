"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/Button"

export function ThemeToggle() {
 const { setTheme, theme } = useTheme()

 return (
  <Button
   variant="ghost"
   size="icon"
   onClick={() => setTheme(theme === "light" ? "dark" : "light")}
   className="rounded-full w-9 h-9 relative flex items-center justify-center"
  >
   <Sun className="h-[1.1rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
   <Moon className="h-[1.1rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
   <span className="sr-only">تغییر تم</span>
  </Button>
 )
}