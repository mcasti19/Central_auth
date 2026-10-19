"use client"

import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/components/layout/sidebar"

export function Topbar() {
  const pathname = usePathname()
  const current = navLinks.find((l) => (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)))

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
      <div className="text-sm text-muted-foreground">
        Central Auth <span className="mx-1.5 text-border">/</span>
        <span className="font-medium text-foreground">{current?.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notificaciones" className="relative">
          <Bell />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-blue-500" />
        </Button>
        <ThemeToggle />
        <div className="flex items-center gap-2.5 border-l pl-4">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">CR</AvatarFallback>
          </Avatar>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium">Carlos Rodríguez</p>
            <p className="text-xs text-muted-foreground">Jefe de Seguridad Lógica</p>
          </div>
        </div>
      </div>
    </header>
  )
}

