"use client";

import { useAuthStore } from "@/stores/auth";
import { useParams } from "next/navigation";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useEnhancedNavigation } from "@/hooks/useEnhancedNavigation";

export default function Header() {
  const { user, logout } = useAuthStore();
  const { navigateToAuth, navigateToPage, isPending } = useEnhancedNavigation();
  const params = useParams();
  const menuRight = useRef<Menu>(null);

  const company = params?.company as string;

  // Debug: log para verificar el usuario
  console.log("Header - Usuario actual:", user);

  const getCompanyName = (company: string) => {
    const companies: Record<string, string> = {
      almivyca: "Almivyca",
      transmivyca: "Transmivyca",
      camabar: "CAMABAR",
    };
    return companies[company] || company;
  };

  const getCompanyColors = (company: string) => {
    const colors: Record<string, { primary: string; secondary: string }> = {
      almivyca: { primary: "#0ea5e9", secondary: "#0284c7" },
      transmivyca: { primary: "#10b981", secondary: "#059669" },
      camabar: { primary: "#ef4444", secondary: "#dc2626" },
    };
    return colors[company] || colors.almivyca;
  };

  const handleLogout = async () => {
    await logout();
    navigateToAuth("login");
  };

  const menuItems = [
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => {
        navigateToPage(`/${company}/profile`);
      },
    },
    {
      label: "Configuración",
      icon: "pi pi-cog",
      command: () => {
        navigateToPage(`/${company}/settings`);
      },
    },
    {
      separator: true,
    },
    {
      label: "Cerrar Sesión",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  const companyColors = getCompanyColors(company);

  return (
    <header
      className="bg-background-primary shadow-md border-b border-border-primary transition-company"
      style={{
        borderBottomColor: companyColors.primary + "20",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre de la empresa */}
          <div className="flex items-center space-x-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: companyColors.primary }}
            >
              {getCompanyName(company)?.[0] || "G"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {getCompanyName(company)}
              </h1>
              <p className="text-sm text-text-secondary">Grupo Mivyca</p>
            </div>
          </div>

          {/* Navegación y controles */}
          <div className="flex items-center space-x-4">
            {/* Indicador de navegación */}
            {isPending && (
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <i className="pi pi-spin pi-spinner"></i>
                <span>Cargando...</span>
              </div>
            )}

            {/* Toggle de tema */}
            <ThemeToggle />

            {/* Información del usuario */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-text-secondary hidden sm:block">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email || "Usuario"}
                </span>
                <div className="relative">
                  <Avatar
                    label={
                      user.firstName?.[0] ||
                      user.email?.[0]?.toUpperCase() ||
                      "U"
                    }
                    size="normal"
                    shape="circle"
                    className="cursor-pointer transition-company"
                    style={{
                      backgroundColor: companyColors.primary,
                      color: "white",
                    }}
                    onClick={(e: any) => menuRight.current?.toggle(e)}
                  />
                  <Menu
                    model={menuItems}
                    popup
                    ref={menuRight}
                    className="mt-2"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-text-secondary">
                  No autenticado
                </span>
                <Avatar
                  icon="pi pi-user"
                  size="normal"
                  shape="circle"
                  className="bg-gray-400"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
