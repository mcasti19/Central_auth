"use client"

import { useCallback, useSyncExternalStore } from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "theme"
const EVENT = "theme-change"

/** Script inline (se ejecuta antes de hidratar) para evitar parpadeo. Por defecto: light. */
export const themeInitScript = `try{var t=localStorage.getItem("${STORAGE_KEY}");document.documentElement.classList.toggle("dark",t==="dark");}catch(e){}`

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}

const getSnapshot = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light")
const getServerSnapshot = (): Theme => "light"

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return { theme, setTheme }
}

