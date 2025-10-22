"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ThemedCard, ThemedButton } from "@/components/shared/ThemedComponents";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  useTheme,
  useCompanyTheme,
} from "@/components/providers/ThemeProvider";

export default function CompanyPage() {
  const params = useParams();
  const { theme } = useTheme();
  const { company, companyInfo } = useCompanyTheme();
  const companyParam = params?.company as string;

  const getCompanyData = (company: string) => {
    const data: Record<
      string,
      {
        name: string;
        description: string;
        features: string[];
        primaryColor: string;
      }
    > = {
      almivyca: {
        name: "Almivyca",
        description: "Gestión integral de almacenes y logística",
        features: [
          "Control de Inventarios",
          "Gestión de Almacenes",
          "Reportes Avanzados",
          "Dashboard Ejecutivo",
        ],
        primaryColor: "#0ea5e9",
      },
      transmivyca: {
        name: "Transmivyca",
        description: "Soluciones de transporte y distribución",
        features: [
          "Gestión de Flota",
          "Seguimiento GPS",
          "Rutas Optimizadas",
          "Control de Combustible",
        ],
        primaryColor: "#10b981",
      },
      camabar: {
        name: "CAMABAR",
        description: "Servicios profesionales y consultoría",
        features: [
          "Gestión de Proyectos",
          "Recursos Humanos",
          "Facturación",
          "CRM Avanzado",
        ],
        primaryColor: "#ef4444",
      },
    };
    return data[company] || data.almivyca;
  };

  const companyData = getCompanyData(companyParam);

  return (
    <div className="min-h-screen bg-background-primary transition-company">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ backgroundColor: companyData.primaryColor }}
              >
                {companyData.name[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  {companyData.name}
                </h1>
                <p className="text-text-secondary">{companyData.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-text-secondary">
                Tema: {theme === "dark" ? "Oscuro" : "Claro"}
              </span>
              <ThemeToggle size="large" />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {companyData.features.map((feature, index) => (
            <ThemedCard
              key={index}
              title={feature}
              className="hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center py-4">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                  style={{
                    backgroundColor: companyData.primaryColor + "20",
                    color: companyData.primaryColor,
                  }}
                >
                  {index + 1}
                </div>
                <p className="text-text-secondary text-sm">
                  Funcionalidad principal de {feature.toLowerCase()}
                </p>
              </div>
            </ThemedCard>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dashboard Card */}
          <ThemedCard
            title="Panel de Control"
            subtitle="Acceso rápido a métricas y reportes"
            actions={
              <Link href={`/${companyParam}/dashboard`}>
                <ThemedButton
                  label="Abrir Dashboard"
                  icon="pi pi-chart-line"
                  variant="primary"
                />
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="bg-background-secondary p-4 rounded-lg transition-company">
                <h4 className="font-semibold text-text-primary mb-2">
                  Estadísticas Rápidas
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">
                      Usuarios activos:
                    </span>
                    <span className="font-bold text-text-primary ml-2">24</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Procesos:</span>
                    <span className="font-bold text-text-primary ml-2">
                      156
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ThemedCard>

          {/* Quick Actions */}
          <ThemedCard
            title="Acciones Rápidas"
            subtitle="Funciones más utilizadas"
          >
            <div className="space-y-3">
              <ThemedButton
                label="Nuevo Registro"
                icon="pi pi-plus"
                variant="primary"
                className="w-full"
              />
              <ThemedButton
                label="Ver Reportes"
                icon="pi pi-file-pdf"
                variant="secondary"
                className="w-full"
              />
              <ThemedButton
                label="Configuraciones"
                icon="pi pi-cog"
                variant="outline"
                className="w-full"
              />
            </div>
          </ThemedCard>

          {/* Theme Demo */}
          <ThemedCard
            title="Demo del Sistema de Temas"
            subtitle="Configuración de apariencia"
          >
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-background-secondary transition-company">
                <h5 className="font-semibold text-text-primary mb-2">
                  Información de Empresa
                </h5>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-text-secondary">Empresa:</span>{" "}
                    <span className="text-text-primary">
                      {companyInfo?.name}
                    </span>
                  </p>
                  <p>
                    <span className="text-text-secondary">
                      Color principal:
                    </span>{" "}
                    <span style={{ color: companyInfo?.primaryColor }}>
                      {companyInfo?.primaryColor}
                    </span>
                  </p>
                  <p>
                    <span className="text-text-secondary">Tema actual:</span>{" "}
                    <span className="text-text-primary">
                      {theme === "dark" ? "Oscuro" : "Claro"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <ThemedButton label="Texto" variant="text" size="small" />
                <ThemedButton label="Outline" variant="outline" size="small" />
              </div>
            </div>
          </ThemedCard>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-6 bg-background-secondary rounded-xl transition-company">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Sistema de Gestión - {companyData.name}
            </h3>
            <p className="text-text-secondary">
              Plataforma integrada del Grupo Mivyca con soporte para temas
              dinámicos y multi-empresa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
