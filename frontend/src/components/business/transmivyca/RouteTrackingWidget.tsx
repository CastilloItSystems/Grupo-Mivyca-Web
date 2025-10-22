"use client";

import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Timeline } from "primereact/timeline";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import { useState, useEffect } from "react";

interface Route {
  id: string;
  ruta: string;
  conductor: string;
  vehiculo: string;
  origen: string;
  destino: string;
  estado: "programada" | "en-transito" | "completada" | "retrasada";
  progreso: number;
  horaInicio: string;
  horaEstimada: string;
  distancia: number;
  combustible: number;
}

interface TimelineEvent {
  status: string;
  date: string;
  icon: string;
  color: string;
  location: string;
  details: string;
}

export function RouteTrackingWidget() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRoutes(getMockRoutes());
      setTimelineEvents(getMockTimelineEvents());
      setLoading(false);
    }, 1000);
  }, []);

  const statusBody = (rowData: Route) => {
    const statusConfig = {
      programada: { label: "Programada", severity: "info" as const },
      "en-transito": { label: "En Tránsito", severity: "warning" as const },
      completada: { label: "Completada", severity: "success" as const },
      retrasada: { label: "Retrasada", severity: "danger" as const },
    };

    const config = statusConfig[rowData.estado];
    return <Tag value={config.label} severity={config.severity} />;
  };

  const progressBody = (rowData: Route) => {
    const color =
      rowData.estado === "retrasada"
        ? "#ef4444"
        : rowData.estado === "completada"
          ? "#10b981"
          : "#3b82f6";

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span>{rowData.progreso}%</span>
          <span>{rowData.distancia} km</span>
        </div>
        <ProgressBar value={rowData.progreso} className="h-2" color={color} />
      </div>
    );
  };

  const conductorBody = (rowData: Route) => {
    return (
      <div className="flex items-center gap-2">
        <Avatar
          label={rowData.conductor
            .split(" ")
            .map((n) => n[0])
            .join("")}
          size="normal"
          style={{ backgroundColor: "#3b82f6", color: "white" }}
        />
        <div>
          <div className="font-medium text-sm">{rowData.conductor}</div>
          <div className="text-xs text-gray-500">{rowData.vehiculo}</div>
        </div>
      </div>
    );
  };

  const timeBody = (rowData: Route) => {
    return (
      <div className="text-sm">
        <div className="font-medium">{rowData.horaInicio}</div>
        <div className="text-xs text-gray-500">Est: {rowData.horaEstimada}</div>
      </div>
    );
  };

  const actionBody = (rowData: Route) => {
    return (
      <div className="flex gap-1">
        <Button
          icon="pi pi-map-marker"
          size="small"
          outlined
          tooltip="Ver en Mapa"
          className="p-button-sm"
        />
        <Button
          icon="pi pi-phone"
          size="small"
          severity="secondary"
          outlined
          tooltip="Contactar"
          className="p-button-sm"
        />
      </div>
    );
  };

  const customizedMarker = (item: TimelineEvent) => {
    return (
      <span
        className="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-lg"
        style={{ backgroundColor: item.color }}
      >
        <i className={`pi pi-${item.icon}`}></i>
      </span>
    );
  };

  const customizedContent = (item: TimelineEvent) => {
    return (
      <Card className="mt-2 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h6 className="font-semibold text-sm">{item.status}</h6>
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>
        <p className="text-gray-600 text-sm mb-1">{item.location}</p>
        <p className="text-gray-500 text-xs">{item.details}</p>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Tabla de rutas activas */}
      <div className="xl:col-span-2">
        <Card
          title="🚛 Rutas Activas en Tiempo Real"
          className="h-full"
          subTitle="Monitoreo y control de entregas"
        >
          <DataTable
            value={routes}
            loading={loading}
            paginator
            rows={6}
            className="p-datatable-sm"
            emptyMessage="No hay rutas activas"
            showGridlines
            stripedRows
            responsiveLayout="scroll"
          >
            <Column
              field="ruta"
              header="Ruta"
              sortable
              className="font-medium"
              style={{ minWidth: "120px" }}
            />
            <Column
              header="Conductor/Vehículo"
              body={conductorBody}
              style={{ minWidth: "150px" }}
            />
            <Column
              field="destino"
              header="Destino"
              sortable
              style={{ minWidth: "120px" }}
            />
            <Column
              header="Progreso"
              body={progressBody}
              style={{ minWidth: "150px" }}
            />
            <Column
              header="Estado"
              body={statusBody}
              style={{ minWidth: "100px" }}
            />
            <Column
              header="Horario"
              body={timeBody}
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

      {/* Timeline de eventos */}
      <div>
        <Card
          title="🕒 Timeline de Eventos"
          className="h-full"
          subTitle="Últimas actualizaciones"
        >
          <Timeline
            value={timelineEvents}
            align="left"
            marker={customizedMarker}
            content={customizedContent}
            className="customized-timeline"
          />
        </Card>
      </div>
    </div>
  );
}

function getMockRoutes(): Route[] {
  return [
    {
      id: "1",
      ruta: "Norte-001",
      conductor: "Juan Pérez",
      vehiculo: "Ford Transit #101",
      origen: "Centro de Distribución",
      destino: "Ciudad Juárez",
      estado: "en-transito",
      progreso: 65,
      horaInicio: "06:00",
      horaEstimada: "14:30",
      distancia: 380,
      combustible: 75,
    },
    {
      id: "2",
      ruta: "Sur-003",
      conductor: "María López",
      vehiculo: "Mercedes Sprinter #205",
      origen: "Centro de Distribución",
      destino: "Guadalajara",
      estado: "programada",
      progreso: 0,
      horaInicio: "08:00",
      horaEstimada: "16:00",
      distancia: 540,
      combustible: 90,
    },
    {
      id: "3",
      ruta: "Este-002",
      conductor: "Carlos García",
      vehiculo: "Isuzu NPR #150",
      origen: "Centro de Distribución",
      destino: "Monterrey",
      estado: "completada",
      progreso: 100,
      horaInicio: "05:30",
      horaEstimada: "13:00",
      distancia: 290,
      combustible: 45,
    },
    {
      id: "4",
      ruta: "Oeste-001",
      conductor: "Ana Martínez",
      vehiculo: "Nissan Urvan #180",
      origen: "Centro de Distribución",
      destino: "Puebla",
      estado: "retrasada",
      progreso: 45,
      horaInicio: "07:00",
      horaEstimada: "15:30",
      distancia: 320,
      combustible: 60,
    },
    {
      id: "5",
      ruta: "Local-005",
      conductor: "Roberto Silva",
      vehiculo: "Ford Transit #102",
      origen: "Centro de Distribución",
      destino: "Zona Metropolitana",
      estado: "en-transito",
      progreso: 80,
      horaInicio: "09:00",
      horaEstimada: "12:00",
      distancia: 45,
      combustible: 85,
    },
  ];
}

function getMockTimelineEvents(): TimelineEvent[] {
  return [
    {
      status: "Entrega Completada",
      date: "10:45 AM",
      icon: "check",
      color: "#10b981",
      location: "Monterrey - Cliente #MC001",
      details: "Paquete entregado exitosamente",
    },
    {
      status: "En Ruta",
      date: "10:30 AM",
      icon: "truck",
      color: "#3b82f6",
      location: "Carretera México-Puebla Km 85",
      details: "Progreso normal, llegada estimada 15:30",
    },
    {
      status: "Retraso Reportado",
      date: "10:15 AM",
      icon: "clock",
      color: "#f59e0b",
      location: "Autopista del Sol",
      details: "Tráfico pesado, 30 min de retraso",
    },
    {
      status: "Carga Iniciada",
      date: "09:45 AM",
      icon: "box",
      color: "#8b5cf6",
      location: "Centro de Distribución",
      details: "Ruta Local-005 iniciada",
    },
    {
      status: "Vehículo en Revisión",
      date: "09:30 AM",
      icon: "cog",
      color: "#6b7280",
      location: "Taller Mecánico",
      details: "Mantenimiento preventivo #180",
    },
  ];
}
