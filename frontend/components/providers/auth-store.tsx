"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  initialApps,
  initialAudit,
  initialPermissions,
  type App,
  type AuditEntry,
  type Employee,
  type Permissions,
  type Role,
  employees,
} from "@/lib/mock-data"

type NewApp = Omit<App, "id" | "status">

type Store = {
  apps: App[]
  employees: Employee[]
  permissions: Permissions
  audit: AuditEntry[]
  toggleRole: (employeeId: string, appId: string, roleId: string, enabled: boolean) => void
  addApp: (app: NewApp) => void
  addRole: (appId: string, role: Omit<Role, "id">) => void
}

const AuthStoreContext = createContext<Store | null>(null)

export function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<App[]>(initialApps)
  const [permissions, setPermissions] = useState<Permissions>(initialPermissions)
  const [audit, setAudit] = useState<AuditEntry[]>(initialAudit)

  const log = useCallback((type: AuditEntry["type"], message: string) => {
    setAudit((prev) => [{ id: crypto.randomUUID(), type, message, time: "Ahora" }, ...prev])
  }, [])

  const toggleRole: Store["toggleRole"] = useCallback(
    (employeeId, appId, roleId, enabled) => {
      setPermissions((prev) => {
        const current = prev[employeeId]?.[appId] ?? []
        const next = enabled ? [...new Set([...current, roleId])] : current.filter((r) => r !== roleId)
        return { ...prev, [employeeId]: { ...prev[employeeId], [appId]: next } }
      })
      const emp = employees.find((e) => e.id === employeeId)
      const app = apps.find((a) => a.id === appId)
      const role = app?.roles.find((r) => r.id === roleId)
      const msg = `Rol '${role?.name}' ${enabled ? "asignado a" : "revocado de"} ${emp?.name} en ${app?.name}`
      log(enabled ? "success" : "warning", msg)
      toast.success(enabled ? "Permiso otorgado" : "Permiso revocado", {
        description: `${msg}. Cambio aplicado en Central Auth.`,
      })
    },
    [apps, log]
  )

  const addApp: Store["addApp"] = useCallback(
    (app) => {
      setApps((prev) => [...prev, { ...app, id: `app-${crypto.randomUUID().slice(0, 8)}`, status: "Activa" }])
      log("info", `Nueva aplicación registrada: ${app.name} (${app.roles.length} roles)`)
      toast.success("Aplicación registrada", {
        description: `${app.name} ya está integrada a Central Auth.`,
      })
    },
    [log]
  )

  const addRole: Store["addRole"] = useCallback(
    (appId, role) => {
      setApps((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, roles: [...a.roles, { ...role, id: `r-${crypto.randomUUID().slice(0, 6)}` }] } : a
        )
      )
      toast.success("Rol creado", { description: `Rol '${role.name}' agregado.` })
    },
    []
  )

  const value = useMemo(
    () => ({ apps, employees, permissions, audit, toggleRole, addApp, addRole }),
    [apps, permissions, audit, toggleRole, addApp, addRole]
  )

  return <AuthStoreContext.Provider value={value}>{children}</AuthStoreContext.Provider>
}

export function useAuthStore() {
  const ctx = useContext(AuthStoreContext)
  if (!ctx) throw new Error("useAuthStore must be used within AuthStoreProvider")
  return ctx
}

