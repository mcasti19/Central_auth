import { Box, Map, QrCode, Scissors, ShieldCheck, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AppIconKey } from "@/lib/mock-data"

const icons = {
  map: Map,
  "shield-check": ShieldCheck,
  "qr-code": QrCode,
  stethoscope: Stethoscope,
  scissors: Scissors,
  box: Box,
} satisfies Record<AppIconKey, React.ComponentType<{ className?: string }>>

export function AppIcon({ icon, color, className }: { icon: AppIconKey; color: string; className?: string }) {
  const Icon = icons[icon]
  return (
    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", color, className)}>
      <Icon className="size-5" />
    </div>
  )
}

