"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { COMPANIES } from "@/lib/constants";
import type { CompanyId } from "@/types";
import {
  InventoryWidget,
  AdvancedMetricsWidget,
  RouteTrackingWidget,
  RestaurantDashboardWidget,
} from "@/components/business";

interface DashboardPageProps {
  params: {
    company: CompanyId;
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { company } = params;
  const companyData = COMPANIES[company];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header del Dashboard */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard - {companyData.displayName}
            </h1>
            <p className="text-gray-600">{getDashboardDescription(company)}</p>
          </div>
          <div className="flex gap-3">
            <Button
              label="Exportar Reporte"
              icon="pi pi-download"
              outlined
              style={{
                borderColor: companyData.primaryColor,
                color: companyData.primaryColor,
              }}
            />
            <Button
              label="Configurar"
              icon="pi pi-cog"
              style={{
                backgroundColor: companyData.primaryColor,
                borderColor: companyData.primaryColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {getKPIs(company).map((kpi, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow"
          >
            <div className="mb-3">
              <i
                className={`pi pi-${kpi.icon} text-3xl`}
                style={{ color: companyData.primaryColor }}
              />
            </div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: companyData.primaryColor }}
            >
              {kpi.value}
            </div>
            <div className="text-sm text-gray-600 mb-2">{kpi.label}</div>
            <div
              className={`text-xs ${kpi.change > 0 ? "text-green-600" : "text-red-600"}`}
            >
              <i
                className={`pi pi-arrow-${kpi.change > 0 ? "up" : "down"} mr-1`}
              />
              {Math.abs(kpi.change)}% vs mes anterior
            </div>
          </Card>
        ))}
      </div>

      {/* Widgets específicos por empresa */}
      {company === "almivyca" && (
        <div className="space-y-6">
          <AdvancedMetricsWidget />
          <InventoryWidget />
        </div>
      )}

      {company === "transmivyca" && (
        <div className="space-y-6">
          <RouteTrackingWidget />
        </div>
      )}

      {company === "camabar" && (
        <div className="space-y-6">
          <RestaurantDashboardWidget />
        </div>
      )}

      {/* Acciones rápidas */}
      <div className="mt-8">
        <Card title="🚀 Acciones Rápidas" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getQuickActions(company).map((action, index) => (
              <Button
                key={index}
                label={action.label}
                icon={`pi pi-${action.icon}`}
                className="p-button-outlined p-button-lg h-16 flex-col"
                style={{
                  borderColor: companyData.primaryColor,
                  color: companyData.primaryColor,
                }}
                onClick={() => {
                  console.log(`Navegando a ${action.route}`);
                }}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Funciones auxiliares específicas por empresa
function getDashboardDescription(company: CompanyId): string {
  const descriptions = {
    almivyca:
      "Gestión integral de inventario y control de stock en tiempo real",
    transmivyca: "Monitoreo de rutas, vehículos y entregas en tiempo real",
    camabar: "Control de órdenes, ventas y operaciones del restaurante",
  };
  return descriptions[company];
}

function getKPIs(company: CompanyId) {
  const kpisByCompany = {
    almivyca: [
      { icon: "box", label: "Productos en Stock", value: "1,234", change: 5.2 },
      { icon: "truck", label: "Pedidos Pendientes", value: "89", change: -2.1 },
      {
        icon: "dollar",
        label: "Valor Inventario",
        value: "$945.2K",
        change: 3.8,
      },
      {
        icon: "percentage",
        label: "Nivel de Servicio",
        value: "98.5%",
        change: 1.2,
      },
    ],
    transmivyca: [
      { icon: "car", label: "Vehículos Activos", value: "45", change: 0 },
      { icon: "map", label: "Rutas Completadas", value: "127", change: 8.3 },
      { icon: "clock", label: "Puntualidad", value: "95.2%", change: 2.1 },
      {
        icon: "gas-pump",
        label: "Eficiencia Combustible",
        value: "12.5L",
        change: -1.5,
      },
    ],
    camabar: [
      {
        icon: "shopping-cart",
        label: "Pedidos Hoy",
        value: "89",
        change: 12.5,
      },
      { icon: "star", label: "Rating Promedio", value: "4.8", change: 0.2 },
      {
        icon: "dollar",
        label: "Ventas del Día",
        value: "$5,780",
        change: 15.7,
      },
      { icon: "users", label: "Clientes Atendidos", value: "156", change: 8.9 },
    ],
  };

  return kpisByCompany[company];
}

function getQuickActions(company: CompanyId) {
  const actionsByCompany = {
    almivyca: [
      { label: "Nuevo Pedido", icon: "plus", route: "/almivyca/pedidos/nuevo" },
      {
        label: "Consultar Stock",
        icon: "search",
        route: "/almivyca/inventario",
      },
      {
        label: "Generar Reporte",
        icon: "file-pdf",
        route: "/almivyca/reportes",
      },
      { label: "Configurar Alertas", icon: "bell", route: "/almivyca/alertas" },
    ],
    transmivyca: [
      { label: "Nueva Ruta", icon: "plus", route: "/transmivyca/rutas/nueva" },
      { label: "Ver Vehículos", icon: "car", route: "/transmivyca/vehiculos" },
      {
        label: "Reporte de Entregas",
        icon: "file-pdf",
        route: "/transmivyca/reportes",
      },
      {
        label: "Mantenimiento",
        icon: "cog",
        route: "/transmivyca/mantenimiento",
      },
    ],
    camabar: [
      { label: "Nuevo Pedido", icon: "plus", route: "/camabar/pedidos/nuevo" },
      { label: "Ver Menú", icon: "list", route: "/camabar/menu" },
      {
        label: "Reporte de Ventas",
        icon: "chart-bar",
        route: "/camabar/reportes",
      },
      { label: "Gestionar Mesas", icon: "home", route: "/camabar/mesas" },
    ],
  };

  return actionsByCompany[company];
}
