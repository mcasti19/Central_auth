"use client"

import { useState } from "react"
import { Briefcase, Building2, CalendarDays, IdCard, Mail, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RoleBadge } from "@/components/role-badge"
import { AppIcon } from "@/components/app-icon"
import { PageHeader } from "@/components/page-header"
import { useAuthStore } from "@/components/providers/auth-store"
import { cn } from "@/lib/utils"

const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("")

export default function UsuariosPage() {
  const { apps, employees, permissions, toggleRole } = useAuthStore()
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>("e1")

  const q = query.trim().toLowerCase()
  const filtered = employees.filter(
    (e) =>
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.cedula.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
  )
  const selected = employees.find((e) => e.id === selectedId)
  const countFor = (id: string) => Object.values(permissions[id] ?? {}).reduce((n, r) => n + r.length, 0)

  return (
    <>
      <PageHeader title="Usuarios y Permisos" description="Busca empleados de la nómina y administra sus roles por aplicación." />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="self-start">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Buscar por nombre, cédula, área…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <ul className="space-y-0.5">
              {filtered.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(e.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted",
                      selectedId === e.id && "bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    )}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-muted text-xs font-medium text-foreground/80">{initials(e.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{e.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{e.department}</p>
                    </div>
                    <Badge variant="secondary">{countFor(e.id)}</Badge>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-2 py-6 text-center text-sm text-muted-foreground">Sin resultados para &quot;{query}&quot;</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {selected ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-blue-100 text-lg font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">{initials(selected.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
                    <Badge className={selected.status === "Activo" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"}>
                      {selected.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selected.position}</p>
                </div>
                <dl className="grid w-full gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <div className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" />{selected.email}</div>
                  <div className="flex items-center gap-2"><IdCard className="size-4 text-muted-foreground" />{selected.cedula}</div>
                  <div className="flex items-center gap-2"><Building2 className="size-4 text-muted-foreground" />{selected.department}</div>
                  <div className="flex items-center gap-2"><CalendarDays className="size-4 text-muted-foreground" />Ingreso: {selected.hireDate}</div>
                  <div className="flex items-center gap-2"><Briefcase className="size-4 text-muted-foreground" />Sincronizado desde nómina</div>
                </dl>
              </CardContent>
            </Card>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Permisos por aplicación</h3>
              <div className="grid gap-4 xl:grid-cols-2">
                {apps.map((app) => {
                  const active = permissions[selected.id]?.[app.id] ?? []
                  return (
                    <Card key={app.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <AppIcon icon={app.icon} color={app.color} className="size-9" />
                          <div className="flex-1">
                            <CardTitle className="text-sm">{app.name}</CardTitle>
                            <CardDescription>{active.length ? `${active.length} rol(es) activo(s)` : "Sin acceso"}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {active.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 border-b pb-3">
                            {app.roles
                              .filter((r) => active.includes(r.id))
                              .map((r) => (
                                <RoleBadge key={r.id} roleId={r.id} name={r.name} description={r.description} />
                              ))}
                          </div>
                        )}
                        {app.roles.map((role) => (
                          <label key={role.id} className="flex cursor-pointer items-center justify-between gap-3">
                            <span>
                              <span className="block text-sm font-medium text-foreground">{role.name}</span>
                              <span className="block text-xs text-muted-foreground">{role.description}</span>
                            </span>
                            <Switch
                              checked={active.includes(role.id)}
                              onCheckedChange={(checked) => toggleRole(selected.id, app.id, role.id, checked)}
                            />
                          </label>
                        ))}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <Card className="self-start">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">Selecciona un empleado para ver sus permisos.</CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

