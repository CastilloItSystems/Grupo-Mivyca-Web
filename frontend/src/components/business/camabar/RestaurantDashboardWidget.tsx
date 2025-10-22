"use client";

import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { ProgressBar } from "primereact/progressbar";
import { useState, useEffect } from "react";

interface Order {
  id: string;
  numeroMesa: string;
  cliente: string;
  items: OrderItem[];
  total: number;
  estado: "pendiente" | "preparando" | "listo" | "servido" | "cancelado";
  tiempoEstimado: number;
  tiempoTranscurrido: number;
  mesero: string;
  tipo: "mesa" | "delivery" | "takeaway";
}

interface OrderItem {
  nombre: string;
  cantidad: number;
  precio: number;
  categoria: string;
}

interface SalesData {
  categoria: string;
  ventas: number;
  cantidad: number;
  color: string;
}

export function RestaurantDashboardWidget() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [salesChart, setSalesChart] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOrders(getMockOrders());
      setSalesData(getMockSalesData());
      setSalesChart(getSalesChartData());
      setLoading(false);
    }, 1000);
  }, []);

  const statusBody = (rowData: Order) => {
    const statusConfig = {
      pendiente: { label: "Pendiente", severity: "warning" as const },
      preparando: { label: "Preparando", severity: "info" as const },
      listo: { label: "Listo", severity: "success" as const },
      servido: { label: "Servido", severity: "secondary" as const },
      cancelado: { label: "Cancelado", severity: "danger" as const },
    };

    const config = statusConfig[rowData.estado];
    return <Tag value={config.label} severity={config.severity} />;
  };

  const tipoBody = (rowData: Order) => {
    const iconMap = {
      mesa: "home",
      delivery: "send",
      takeaway: "shopping-bag",
    };

    return (
      <div className="flex items-center gap-2">
        <i className={`pi pi-${iconMap[rowData.tipo]}`} />
        <span className="capitalize">{rowData.tipo}</span>
      </div>
    );
  };

  const mesaBody = (rowData: Order) => {
    return (
      <div className="flex items-center gap-2">
        <Badge value={rowData.numeroMesa} severity="info" />
        <div>
          <div className="font-medium text-sm">{rowData.cliente}</div>
          <div className="text-xs text-gray-500">{rowData.mesero}</div>
        </div>
      </div>
    );
  };

  const tiempoBody = (rowData: Order) => {
    const progreso =
      (rowData.tiempoTranscurrido / rowData.tiempoEstimado) * 100;
    const isOvertime = progreso > 100;

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className={isOvertime ? "text-red-600" : "text-gray-600"}>
            {rowData.tiempoTranscurrido} min
          </span>
          <span className="text-gray-500">
            Est: {rowData.tiempoEstimado} min
          </span>
        </div>
        <ProgressBar
          value={Math.min(progreso, 100)}
          className="h-2"
          color={isOvertime ? "#ef4444" : progreso > 80 ? "#f59e0b" : "#10b981"}
        />
        {isOvertime && (
          <div className="text-xs text-red-600 mt-1">
            <i className="pi pi-exclamation-triangle mr-1" />
            ¡Tiempo excedido!
          </div>
        )}
      </div>
    );
  };

  const totalBody = (rowData: Order) => {
    return (
      <div className="text-right">
        <div className="font-bold text-lg">${rowData.total.toFixed(2)}</div>
        <div className="text-xs text-gray-500">
          {rowData.items.length} items
        </div>
      </div>
    );
  };

  const actionBody = (rowData: Order) => {
    return (
      <div className="flex gap-1">
        <Button
          icon="pi pi-eye"
          size="small"
          outlined
          tooltip="Ver Detalles"
          className="p-button-sm"
        />
        <Button
          icon="pi pi-pencil"
          size="small"
          severity="secondary"
          outlined
          tooltip="Editar"
          className="p-button-sm"
          disabled={
            rowData.estado === "servido" || rowData.estado === "cancelado"
          }
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Órdenes activas */}
      <div className="xl:col-span-3">
        <Card
          title="🍽️ Órdenes Activas del Restaurante"
          className="h-full"
          subTitle="Gestión en tiempo real de pedidos"
        >
          <DataTable
            value={orders}
            loading={loading}
            paginator
            rows={8}
            className="p-datatable-sm"
            emptyMessage="No hay órdenes activas"
            showGridlines
            stripedRows
            responsiveLayout="scroll"
          >
            <Column
              header="Mesa/Cliente"
              body={mesaBody}
              style={{ minWidth: "150px" }}
            />
            <Column
              header="Tipo"
              body={tipoBody}
              style={{ minWidth: "100px" }}
            />
            <Column
              header="Estado"
              body={statusBody}
              style={{ minWidth: "100px" }}
            />
            <Column
              header="Tiempo"
              body={tiempoBody}
              style={{ minWidth: "150px" }}
            />
            <Column
              header="Total"
              body={totalBody}
              style={{ minWidth: "100px" }}
            />
            <Column
              header="Acciones"
              body={actionBody}
              style={{ minWidth: "100px" }}
            />
          </DataTable>
        </Card>
      </div>

      {/* Ventas por categoría */}
      <div>
        <Card title="📊 Ventas por Categoría" className="h-full" subTitle="Hoy">
          <Chart
            type="doughnut"
            data={salesChart}
            className="w-full h-48 mb-4"
          />

          <div className="space-y-3">
            {salesData.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.categoria}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">${item.ventas}</div>
                  <div className="text-xs text-gray-500">
                    {item.cantidad} u.
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total del Día</span>
              <span className="font-bold text-lg">
                $
                {salesData
                  .reduce((sum, item) => sum + item.ventas, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function getMockOrders(): Order[] {
  return [
    {
      id: "1",
      numeroMesa: "Mesa 5",
      cliente: "Familia García",
      items: [
        {
          nombre: "Pizza Margarita",
          cantidad: 2,
          precio: 180,
          categoria: "Platos Principales",
        },
        { nombre: "Coca Cola", cantidad: 3, precio: 35, categoria: "Bebidas" },
      ],
      total: 465,
      estado: "preparando",
      tiempoEstimado: 25,
      tiempoTranscurrido: 18,
      mesero: "Ana López",
      tipo: "mesa",
    },
    {
      id: "2",
      numeroMesa: "DEL001",
      cliente: "Juan Pérez",
      items: [
        {
          nombre: "Hamburguesa Clásica",
          cantidad: 1,
          precio: 150,
          categoria: "Platos Principales",
        },
        {
          nombre: "Papas Fritas",
          cantidad: 1,
          precio: 65,
          categoria: "Acompañamientos",
        },
      ],
      total: 215,
      estado: "listo",
      tiempoEstimado: 20,
      tiempoTranscurrido: 22,
      mesero: "Carlos Rivera",
      tipo: "delivery",
    },
    {
      id: "3",
      numeroMesa: "Mesa 2",
      cliente: "Pareja Rodríguez",
      items: [
        {
          nombre: "Ensalada César",
          cantidad: 2,
          precio: 120,
          categoria: "Entradas",
        },
        {
          nombre: "Vino Tinto",
          cantidad: 1,
          precio: 280,
          categoria: "Bebidas",
        },
      ],
      total: 520,
      estado: "pendiente",
      tiempoEstimado: 15,
      tiempoTranscurrido: 5,
      mesero: "María Torres",
      tipo: "mesa",
    },
    {
      id: "4",
      numeroMesa: "TO001",
      cliente: "Luis Mendoza",
      items: [
        {
          nombre: "Tacos al Pastor",
          cantidad: 3,
          precio: 45,
          categoria: "Platos Principales",
        },
      ],
      total: 135,
      estado: "preparando",
      tiempoEstimado: 12,
      tiempoTranscurrido: 15,
      mesero: "Pedro Sánchez",
      tipo: "takeaway",
    },
    {
      id: "5",
      numeroMesa: "Mesa 8",
      cliente: "Grupo de Amigos",
      items: [
        {
          nombre: "Alitas BBQ",
          cantidad: 2,
          precio: 95,
          categoria: "Entradas",
        },
        {
          nombre: "Cerveza Nacional",
          cantidad: 6,
          precio: 45,
          categoria: "Bebidas",
        },
      ],
      total: 460,
      estado: "servido",
      tiempoEstimado: 18,
      tiempoTranscurrido: 16,
      mesero: "Sofia Vega",
      tipo: "mesa",
    },
  ];
}

function getMockSalesData(): SalesData[] {
  return [
    {
      categoria: "Platos Principales",
      ventas: 2450,
      cantidad: 28,
      color: "#ff6384",
    },
    {
      categoria: "Bebidas",
      ventas: 1680,
      cantidad: 45,
      color: "#36a2eb",
    },
    {
      categoria: "Entradas",
      ventas: 890,
      cantidad: 18,
      color: "#ffce56",
    },
    {
      categoria: "Postres",
      ventas: 420,
      cantidad: 12,
      color: "#4bc0c0",
    },
    {
      categoria: "Acompañamientos",
      ventas: 340,
      cantidad: 15,
      color: "#9966ff",
    },
  ];
}

function getSalesChartData() {
  const data = getMockSalesData();

  return {
    labels: data.map((item) => item.categoria),
    datasets: [
      {
        data: data.map((item) => item.ventas),
        backgroundColor: data.map((item) => item.color),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };
}
