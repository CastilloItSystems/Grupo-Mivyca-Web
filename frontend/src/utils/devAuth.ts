"use client";

import type { User } from "@/types";

/**
 * Utilidades para autenticación en modo desarrollo
 * Permite simular usuarios sin necesidad del backend
 */

export const DEV_USERS = {
  almivyca: {
    id: "dev-almivyca-1",
    email: "admin@almivyca.com",
    firstName: "Admin",
    lastName: "Almivyca",
    companyAccess: [
      {
        companyId: "almivyca" as const,
        role: "admin" as const,
        permissions: [
          {
            resource: "products",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "inventory",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "reports",
            actions: ["create", "read", "update", "delete"],
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  transmivyca: {
    id: "dev-transmivyca-1",
    email: "admin@transmivyca.com",
    firstName: "Admin",
    lastName: "Transmivyca",
    companyAccess: [
      {
        companyId: "transmivyca" as const,
        role: "admin" as const,
        permissions: [
          {
            resource: "vehicles",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "routes",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "drivers",
            actions: ["create", "read", "update", "delete"],
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  camabar: {
    id: "dev-camabar-1",
    email: "admin@camabar.com",
    firstName: "Admin",
    lastName: "CAMABAR",
    companyAccess: [
      {
        companyId: "camabar" as const,
        role: "admin" as const,
        permissions: [
          { resource: "menu", actions: ["create", "read", "update", "delete"] },
          {
            resource: "orders",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "tables",
            actions: ["create", "read", "update", "delete"],
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
} satisfies Record<string, User>;

export const createDevToken = (companyId: string) => {
  return `dev-token-${companyId}-${Date.now()}`;
};

export const isDevMode = () => {
  return process.env.NODE_ENV === "development";
};

export const getDevUserByCompany = (companyId: string): User | null => {
  if (!isDevMode()) return null;

  const validCompanies = Object.keys(DEV_USERS);
  if (!validCompanies.includes(companyId)) {
    return null;
  }

  return DEV_USERS[companyId as keyof typeof DEV_USERS];
};

export const autoLoginInDev = (companyId?: string) => {
  if (!isDevMode()) return null;

  // Si no se especifica compañía, usar almivyca por defecto
  const targetCompany = companyId || "almivyca";
  const user = getDevUserByCompany(targetCompany);

  if (!user) return null;

  const token = createDevToken(targetCompany);

  // Guardar en localStorage
  localStorage.setItem("mivyca_auth_token", token);
  localStorage.setItem("mivyca_user_data", JSON.stringify(user));

  console.log(`🔧 Auto-login in dev mode for ${targetCompany}:`, user.email);

  return { user, token };
};

export const clearDevAuth = () => {
  localStorage.removeItem("mivyca_auth_token");
  localStorage.removeItem("mivyca_user_data");
  localStorage.removeItem("mivyca_refresh_token");
  localStorage.removeItem("mivyca-auth-store");
  console.log("🔧 Dev auth cleared");
};
