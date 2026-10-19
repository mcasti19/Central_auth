"use client"

import { AlertTriangle, CheckCircle2, Info, LayoutGrid, ShieldAlert, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { useAuthStore } from "@/components/providers/auth-store"
import { TOTAL_PAYROLL_EMPLOYEES, type AuditEntry } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const auditStyle: Record<AuditEntry["type"], { icon: typeof Info; cls: string }> = {
  critical: { icon: ShieldAlert, cls: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300" },
  warning: { icon: AlertTriangle, cls: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" },
  info: { icon: Info, cls: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300" },
  success: { icon: CheckCircle2, cls: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" },
}

function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon: typeof Users }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { apps, audit, permissions } = useAuthStore()
  const alerts = audit.filter((a) => a.type === "critical" || a.type === "warning").length
  const grants = Object.values(permissions).reduce(
    (n, byApp) => n + Object.values(byApp).reduce((m, r) => m + r.length, 0),
    0
  )

  return (
    <>
      <PageHeader title="Resumen" description="Estado general del sistema de autenticación centralizada." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Empleados sincronizados" value={TOTAL_PAYROLL_EMPLOYEES.toLocaleString("es")} hint="Desde nómina · hace 3 h" icon={Users} />
        <StatCard label="Aplicaciones integradas" value={String(apps.length)} hint="Conectadas a Central Auth" icon={LayoutGrid} />
        <StatCard label="Roles asignados" value={String(grants)} hint="Entre empleados de muestra" icon={CheckCircle2} />
        <StatCard label="Alertas de seguridad" value={String(alerts)} hint="Requieren revisión" icon={ShieldAlert} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Actividad y alertas recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {audit.map((a) => {
              const { icon: Icon, cls } = auditStyle[a.type]
              return (
                <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", cls)}>
                    <Icon className="size-4" />
                  </div>
                  <p className="flex-1 text-sm text-foreground/80">{a.message}</p>
                  <Badge variant="secondary" className="shrink-0">{a.time}</Badge>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
