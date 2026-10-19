"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RoleBadge } from "@/components/role-badge"
import { AppIcon } from "@/components/app-icon"
import { PageHeader } from "@/components/page-header"
import { useAuthStore } from "@/components/providers/auth-store"
import type { Role } from "@/lib/mock-data"

type RoleDraft = Omit<Role, "id">

function NewAppDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addApp } = useAuthStore()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [roles, setRoles] = useState<RoleDraft[]>([{ name: "Administrador", description: "Control total" }])

  const reset = () => {
    setName("")
    setDescription("")
    setRoles([{ name: "Administrador", description: "Control total" }])
  }

  const validRoles = roles.filter((r) => r.name.trim())
  const canSubmit = name.trim() && validRoles.length > 0

  const submit = () => {
    if (!canSubmit) return
    addApp({
      name: name.trim(),
      description: description.trim() || "Nueva aplicación integrada.",
      icon: "scissors",
      color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
      roles: validRoles.map((r, i) => ({ ...r, id: `role-${i}-${r.name.toLowerCase().replace(/\s+/g, "-")}` })),
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar nueva aplicación</DialogTitle>
          <DialogDescription>Define el sistema y los roles que podrán asignarse a los empleados.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="app-name">Nombre</Label>
            <Input id="app-name" placeholder="Ej. Barbería / SPA" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="app-desc">Descripción</Label>
            <Input id="app-desc" placeholder="Ej. Reservas de servicios de bienestar" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Roles</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setRoles([...roles, { name: "", description: "" }])}>
                <Plus /> Agregar rol
              </Button>
            </div>
            {roles.map((r, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder="Nombre del rol" value={r.name} onChange={(e) => setRoles(roles.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <Input placeholder="Descripción" value={r.description} onChange={(e) => setRoles(roles.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
                <Button type="button" variant="ghost" size="icon" disabled={roles.length === 1} onClick={() => setRoles(roles.filter((_, j) => j !== i))}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button disabled={!canSubmit} onClick={submit}>
            Registrar aplicación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AplicacionesPage() {
  const { apps } = useAuthStore()
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageHeader title="Aplicaciones" description="Sistemas integrados a la autenticación centralizada.">
        <Button onClick={() => setOpen(true)}>
          <Plus /> Registrar Nueva Aplicación
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app) => (
          <Card key={app.id} className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start gap-3">
                <AppIcon icon={app.icon} color={app.color} />
                <div className="min-w-0 flex-1">
                  <CardTitle>{app.name}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </div>
                <Badge variant={app.status === "Activa" ? "default" : "secondary"} className={app.status === "Activa" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"}>
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Roles ({app.roles.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {app.roles.map((r) => (
                  <RoleBadge key={r.id} roleId={r.id} name={r.name} description={r.description} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewAppDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

