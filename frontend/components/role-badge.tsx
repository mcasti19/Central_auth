import { Crown, Eye, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

type Tier = "admin" | "manage" | "view"

const manageRoles = ["editor", "approver", "issuer", "doctor", "reception"]

export function roleTier(roleId: string): Tier {
  if (roleId === "admin" || roleId.endsWith("administrador")) return "admin"
  if (manageRoles.includes(roleId)) return "manage"
  return "view"
}

const styles: Record<Tier, { wrap: string; chip: string; icon: typeof Eye }> = {
  admin: {
    wrap: "border-blue-700/30 bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-sm shadow-blue-900/20 dark:border-blue-400/30",
    chip: "bg-white/20 text-white",
    icon: Crown,
  },
  manage: {
    wrap: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/25 dark:bg-blue-500/10 dark:text-blue-200",
    chip: "bg-blue-600 text-white dark:bg-blue-500",
    icon: PenLine,
  },
  view: {
    wrap: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-400/20 dark:bg-slate-500/10 dark:text-slate-200",
    chip: "bg-slate-200 text-slate-600 dark:bg-slate-500/30 dark:text-slate-200",
    icon: Eye,
  },
}

export function RoleBadge({
  roleId,
  name,
  description,
  className,
}: {
  roleId: string
  name: string
  description?: string
  className?: string
}) {
  const tier = roleTier(roleId)
  const { wrap, chip, icon: Icon } = styles[tier]
  return (
    <span
      title={description}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2.5 text-xs font-medium",
        wrap,
        className
      )}
    >
      <span className={cn("flex size-5 items-center justify-center rounded-full", chip)}>
        <Icon className="size-3" />
      </span>
      {name}
    </span>
  )
}

