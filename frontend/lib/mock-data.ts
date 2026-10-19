export type Role = { id: string; name: string; description: string }

export type App = {
  id: string
  name: string
  description: string
  icon: AppIconKey
  color: string
  status: "Activa" | "Mantenimiento"
  roles: Role[]
}

export type AppIconKey = "map" | "shield-check" | "qr-code" | "stethoscope" | "scissors" | "box"

export type Employee = {
  id: string
  name: string
  email: string
  cedula: string
  department: string
  position: string
  status: "Activo" | "Suspendido"
  hireDate: string
}

/** employeeId -> appId -> roleIds */
export type Permissions = Record<string, Record<string, string[]>>

export type AuditEntry = {
  id: string
  type: "info" | "warning" | "critical" | "success"
  message: string
  time: string
}

export const initialApps: App[] = [
  {
    id: "mapa",
    name: "Mapa de Establecimientos",
    description: "Geolocalización y gestión de establecimientos registrados.",
    icon: "map",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    status: "Activa",
    roles: [
      { id: "viewer", name: "Visualizador", description: "Solo consulta del mapa" },
      { id: "editor", name: "Editor", description: "Crea y edita establecimientos" },
      { id: "admin", name: "Administrador", description: "Control total del módulo" },
    ],
  },
  {
    id: "mercado",
    name: "Validación de Mercado",
    description: "Verificación y validación de estudios de mercado.",
    icon: "shield-check",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    status: "Activa",
    roles: [
      { id: "analyst", name: "Analista", description: "Revisa validaciones" },
      { id: "approver", name: "Aprobador", description: "Aprueba o rechaza" },
      { id: "admin", name: "Administrador", description: "Control total del módulo" },
    ],
  },
  {
    id: "carnet",
    name: "Carnet Digital QR",
    description: "Emisión y verificación de carnets digitales con código QR.",
    icon: "qr-code",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    status: "Activa",
    roles: [
      { id: "issuer", name: "Emisor", description: "Emite carnets" },
      { id: "verifier", name: "Verificador", description: "Escanea y valida QR" },
      { id: "admin", name: "Administrador", description: "Control total del módulo" },
    ],
  },
  {
    id: "citas",
    name: "Citas Médicas",
    description: "Agendamiento y seguimiento de citas médicas del personal.",
    icon: "stethoscope",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    status: "Mantenimiento",
    roles: [
      { id: "patient", name: "Paciente", description: "Solicita citas" },
      { id: "doctor", name: "Médico", description: "Gestiona su agenda" },
      { id: "reception", name: "Recepción", description: "Administra agendas" },
      { id: "admin", name: "Administrador", description: "Control total del módulo" },
    ],
  },
]

export const employees: Employee[] = [
  { id: "e1", name: "Juan Pérez", email: "juan.perez@empresa.com", cedula: "V-12.345.678", department: "Tecnología", position: "Desarrollador Senior", status: "Activo", hireDate: "2019-03-12" },
  { id: "e2", name: "María González", email: "maria.gonzalez@empresa.com", cedula: "V-14.221.903", department: "Recursos Humanos", position: "Analista de Nómina", status: "Activo", hireDate: "2017-08-01" },
  { id: "e3", name: "Carlos Rodríguez", email: "carlos.rodriguez@empresa.com", cedula: "V-10.987.654", department: "Seguridad Lógica", position: "Jefe de Seguridad", status: "Activo", hireDate: "2015-01-20" },
  { id: "e4", name: "Ana Martínez", email: "ana.martinez@empresa.com", cedula: "V-18.456.120", department: "Servicios Médicos", position: "Médico Ocupacional", status: "Activo", hireDate: "2021-05-17" },
  { id: "e5", name: "Luis Hernández", email: "luis.hernandez@empresa.com", cedula: "V-16.738.245", department: "Operaciones", position: "Supervisor de Campo", status: "Suspendido", hireDate: "2018-11-05" },
  { id: "e6", name: "Sofía Ramírez", email: "sofia.ramirez@empresa.com", cedula: "V-20.114.332", department: "Mercadeo", position: "Analista de Mercado", status: "Activo", hireDate: "2022-02-14" },
  { id: "e7", name: "Pedro Castillo", email: "pedro.castillo@empresa.com", cedula: "V-13.502.871", department: "Tecnología", position: "Administrador de Sistemas", status: "Activo", hireDate: "2016-09-30" },
  { id: "e8", name: "Lucía Fernández", email: "lucia.fernandez@empresa.com", cedula: "V-19.670.415", department: "Recepción", position: "Recepcionista", status: "Activo", hireDate: "2023-01-09" },
]

export const initialPermissions: Permissions = {
  e1: { mapa: ["editor"], carnet: ["verifier"], citas: ["patient"] },
  e2: { carnet: ["issuer"], citas: ["patient"] },
  e3: { mapa: ["admin"], mercado: ["admin"], carnet: ["admin"], citas: ["admin"] },
  e4: { citas: ["doctor"] },
  e5: {},
  e6: { mercado: ["analyst", "approver"], mapa: ["viewer"] },
  e7: { mapa: ["admin"], carnet: ["admin"] },
  e8: { citas: ["reception"], carnet: ["verifier"] },
}

export const initialAudit: AuditEntry[] = [
  { id: "a1", type: "critical", message: "5 intentos fallidos de inicio de sesión para luis.hernandez (cuenta suspendida)", time: "Hace 12 min" },
  { id: "a2", type: "warning", message: "Acceso desde IP no habitual al módulo Mapa de Establecimientos", time: "Hace 1 h" },
  { id: "a3", type: "info", message: "Sincronización de nómina completada: 1.248 empleados", time: "Hace 3 h" },
  { id: "a4", type: "success", message: "Rol 'Aprobador' asignado a Sofía Ramírez en Validación de Mercado", time: "Ayer" },
]

export const TOTAL_PAYROLL_EMPLOYEES = 1248

