import type { AppConfig, Company, CompanyId } from "@/types";

// Configuración de las empresas del Grupo Mivyca
export const COMPANIES: Record<CompanyId, Company> = {
  almivyca: {
    id: "almivyca",
    name: "almivyca",
    displayName: "Almivyca",
    description: "Servicios de almacenamiento y logística",
    primaryColor: "#0ea5e9", // sky-500
    secondaryColor: "#0284c7", // sky-600
  },
  transmivyca: {
    id: "transmivyca",
    name: "transmivyca",
    displayName: "Transmivyca",
    description: "Servicios de transporte y distribución",
    primaryColor: "#10b981", // emerald-500
    secondaryColor: "#059669", // emerald-600
  },
  camabar: {
    id: "camabar",
    name: "camabar",
    displayName: "CAMABAR",
    description: "Restaurante y servicios de alimentación",
    primaryColor: "#ef4444", // red-500
    secondaryColor: "#dc2626", // red-600
  },
};

// URLs de la API
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    profile: "/api/auth/profile",
    logout: "/api/auth/logout",
  },
  users: {
    list: "/api/users",
    create: "/api/users",
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
  },
  companies: {
    list: "/api/companies",
    current: "/api/companies/current",
  },
} as const;

// Configuración de la aplicación
export const APP_CONFIG: AppConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  environment: (process.env.NODE_ENV as any) || "development",
  companies: COMPANIES,
};

// Roles de usuario
export const USER_ROLES = {
  admin: {
    label: "Administrador",
    permissions: ["create", "read", "update", "delete"] as const,
  },
  manager: {
    label: "Gerente",
    permissions: ["create", "read", "update"] as const,
  },
  employee: {
    label: "Empleado",
    permissions: ["read", "update"] as const,
  },
  viewer: {
    label: "Visualizador",
    permissions: ["read"] as const,
  },
} as const;

// Configuración de navegación por empresa
export const COMPANY_NAVIGATION: Record<
  CompanyId,
  Array<{
    id: string;
    label: string;
    href: string;
    icon?: string;
  }>
> = {
  almivyca: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/almivyca/dashboard",
      icon: "chart-line",
    },
    {
      id: "inventario",
      label: "Inventario",
      href: "/almivyca/inventario",
      icon: "box",
    },
    {
      id: "almacenes",
      label: "Almacenes",
      href: "/almivyca/almacenes",
      icon: "building",
    },
    {
      id: "reportes",
      label: "Reportes",
      href: "/almivyca/reportes",
      icon: "file-pdf",
    },
  ],
  transmivyca: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/transmivyca/dashboard",
      icon: "chart-line",
    },
    { id: "rutas", label: "Rutas", href: "/transmivyca/rutas", icon: "map" },
    {
      id: "vehiculos",
      label: "Vehículos",
      href: "/transmivyca/vehiculos",
      icon: "car",
    },
    {
      id: "conductores",
      label: "Conductores",
      href: "/transmivyca/conductores",
      icon: "users",
    },
    {
      id: "reportes",
      label: "Reportes",
      href: "/transmivyca/reportes",
      icon: "file-pdf",
    },
  ],
  camabar: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/camabar/dashboard",
      icon: "chart-line",
    },
    { id: "menu", label: "Menú", href: "/camabar/menu", icon: "list" },
    {
      id: "pedidos",
      label: "Pedidos",
      href: "/camabar/pedidos",
      icon: "shopping-bag",
    },
    {
      id: "reportes",
      label: "Reportes",
      href: "/camabar/reportes",
      icon: "file-pdf",
    },
  ],
} as const;

// Configuración de localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: "mivyca_auth_token",
  USER_DATA: "mivyca_user_data",
  COMPANY_PREFERENCE: "mivyca_company_preference",
  THEME_PREFERENCE: "mivyca_theme_preference",
} as const;

// Configuración de validación
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Formato de email inválido",
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    message:
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
  },
} as const;

// Mensajes de la aplicación
export const MESSAGES = {
  auth: {
    loginSuccess: "Inicio de sesión exitoso",
    loginError: "Credenciales inválidas",
    logoutSuccess: "Sesión cerrada correctamente",
    registerSuccess: "Registro exitoso",
    registerError: "Error en el registro",
    tokenExpired: "Tu sesión ha expirado",
  },
  general: {
    loading: "Cargando...",
    error: "Ha ocurrido un error",
    success: "Operación exitosa",
    noData: "No hay datos disponibles",
    unauthorized: "No tienes permisos para realizar esta acción",
  },
} as const;
