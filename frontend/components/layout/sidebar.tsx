"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, LayoutDashboard, LayoutGrid, ShieldCheck, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export const navLinks = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/aplicaciones", label: "Aplicaciones", icon: LayoutGrid },
  { href: "/usuarios", label: "Usuarios y Permisos", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const ToggleIcon = collapsed ? ChevronRight : ChevronLeft

  return (
    <aside
      className={cn(
        "relative sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Botón de colapso integrado en la línea divisoria */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? "Expandir menú" : "Colapsar menú"}
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        className="absolute -right-3 top-[26px] z-40 flex size-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
      >
        <ToggleIcon className="size-3.5" />
      </button>

      <div className={cn("flex h-[68px] items-center border-b border-sidebar-border", collapsed ? "justify-center" : "gap-3 px-5")}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/40">
          <ShieldCheck className="size-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-white">Central Auth</p>
            <p className="truncate text-[11px] uppercase tracking-wider text-blue-300/70">Seguridad Lógica</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {!collapsed && <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-blue-300/50">Administración</p>}
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              aria-label={label}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-blue-500/15 text-white ring-1 ring-inset ring-blue-400/20"
                  : "text-blue-100/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-blue-400" />}
              <Icon className={cn("size-[18px] shrink-0", active && "text-blue-300")} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="m-3 rounded-lg border border-sidebar-border bg-white/[0.03] p-3 text-xs text-blue-200/60">
          <p className="font-medium text-blue-100/80">Entorno de demostración</p>
          <p className="mt-0.5">Datos simulados · MVP</p>
        </div>
      )}
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 overflow-x-auto bg-sidebar p-2 md:hidden">
      {navLinks.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-blue-100/70",
              active && "bg-blue-500/15 text-white"
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
