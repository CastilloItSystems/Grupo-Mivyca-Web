"use client";

import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Skeleton } from "primereact/skeleton";
import {
  useProducts,
  useInventoryStats,
  useInventoryAlerts,
} from "@/hooks/useAlmivyca";
import { useEffect } from "react";
import type { Product, InventoryAlert } from "@/types";

export function InventoryWidget() {
  // Hooks para datos reales
  const products = useProducts();
  const stats = useInventoryStats();
  const alerts = useInventoryAlerts();

  // Cargar datos iniciales
  useEffect(() => {
    products.list.execute({ limit: 10, lowStock: true });
    alerts.list.execute({ limit: 5 });
  }, []);

  const stockLevelBody = (rowData: Product) => {
    const percentage = (rowData.quantity / rowData.maxStock) * 100;
    const severity =
      percentage > 70 ? "success" : percentage > 30 ? "warning" : "danger";

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span>{rowData.quantity}</span>
          <span>{rowData.maxStock}</span>
        </div>
        <ProgressBar
          value={percentage}
          className="h-2"
          color={
            severity === "success"
              ? "#22c55e"
              : severity === "warning"
                ? "#f59e0b"
                : "#ef4444"
          }
        />
      </div>
    );
  };

  const statusBody = (rowData: Product) => {
    const percentage = (rowData.quantity / rowData.maxStock) * 100;
    let severity: "success" | "warning" | "danger" = "success";
    let label = "En Stock";

    if (percentage <= 0) {
      severity = "danger";
      label = "Sin Stock";
    } else if (percentage <= 20) {
      severity = "danger";
      label = "Stock Crítico";
    } else if (percentage <= 50) {
      severity = "warning";
      label = "Stock Bajo";
    }

    return <Tag severity={severity} value={label} />;
  };

  const valueBody = (rowData: Product) => {
    const totalValue = rowData.quantity * rowData.unitPrice;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(totalValue);
  };

  const alertSeverityBody = (rowData: InventoryAlert) => {
    const severityMap = {
      CRITICAL: "danger",
      WARNING: "warning",
      INFO: "info",
    } as const;

    return (
      <Tag
        severity={severityMap[rowData.level]}
        value={rowData.level}
        className="text-xs"
      />
    );
  };

  const alertActions = (rowData: InventoryAlert) => {
    return (
      <div className="flex gap-1">
        <Button
          icon="pi pi-check"
          size="small"
          text
          severity="success"
          onClick={() => alerts.markAsRead.execute(rowData.id)}
          loading={alerts.markAsRead.loading}
          disabled={rowData.isRead}
          tooltip="Marcar como leída"
        />
        <Button
          icon="pi pi-times"
          size="small"
          text
          severity="secondary"
          onClick={() => alerts.dismiss.execute(rowData.id)}
          loading={alerts.dismiss.loading}
          disabled={rowData.isDismissed}
          tooltip="Descartar"
        />
      </div>
    );
  };

  const refreshData = () => {
    products.list.refresh();
    stats.execute();
    alerts.list.refresh();
  };

  if (stats.error || products.list.error || alerts.list.error) {
    return (
      <Card
        title="Inventario"
        subTitle="Gestión de stock y productos"
        className="h-full"
      >
        <Message
          severity="error"
          text={
            stats.error ||
            products.list.error ||
            alerts.list.error ||
            "Error al cargar datos"
          }
          className="w-full"
        />
        <Button
          label="Reintentar"
          icon="pi pi-refresh"
          onClick={refreshData}
          className="mt-3"
        />
      </Card>
    );
  }

  return (
    <Card
      title="Inventario"
      subTitle="Gestión de stock y productos"
      className="h-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Inventario</h3>
        <Button
          icon="pi pi-refresh"
          size="small"
          text
          onClick={refreshData}
          loading={
            products.list.loading || stats.loading || alerts.list.loading
          }
          tooltip="Actualizar datos"
        />
      </div>

      <div className="space-y-6">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {stats.loading ? (
                <Skeleton width="3rem" height="2rem" />
              ) : (
                stats.data?.totalProducts || 0
              )}
            </div>
            <div className="text-sm text-blue-500">Total Productos</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.loading ? (
                <Skeleton width="4rem" height="2rem" />
              ) : (
                new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 0,
                }).format(stats.data?.totalValue || 0)
              )}
            </div>
            <div className="text-sm text-green-500">Valor Total</div>
          </div>

          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.loading ? (
                <Skeleton width="2rem" height="2rem" />
              ) : (
                stats.data?.lowStockCount || 0
              )}
            </div>
            <div className="text-sm text-yellow-500">Stock Bajo</div>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {stats.loading ? (
                <Skeleton width="2rem" height="2rem" />
              ) : (
                stats.data?.outOfStockCount || 0
              )}
            </div>
            <div className="text-sm text-red-500">Sin Stock</div>
          </div>
        </div>

        {/* Productos con Stock Bajo */}
        <div>
          <h4 className="text-md font-medium mb-3 text-gray-700">
            Productos con Stock Bajo
          </h4>
          {products.list.loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height="3rem" />
              ))}
            </div>
          ) : (
            <DataTable
              value={products.list.data}
              size="small"
              stripedRows
              emptyMessage="No hay productos con stock bajo"
            >
              <Column field="name" header="Producto" />
              <Column field="category" header="Categoría" />
              <Column
                header="Stock"
                body={stockLevelBody}
                style={{ width: "150px" }}
              />
              <Column header="Estado" body={statusBody} />
              <Column
                header="Valor"
                body={valueBody}
                style={{ textAlign: "right" }}
              />
            </DataTable>
          )}
        </div>

        {/* Alertas de Inventario */}
        <div>
          <h4 className="text-md font-medium mb-3 text-gray-700">
            Alertas Recientes
          </h4>
          {alerts.list.loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height="2.5rem" />
              ))}
            </div>
          ) : (
            <DataTable
              value={alerts.list.data.filter(
                (alert: any) => !alert.isRead && !alert.isDismissed
              )}
              size="small"
              emptyMessage="No hay alertas pendientes"
            >
              <Column field="message" header="Mensaje" />
              <Column header="Nivel" body={alertSeverityBody} />
              <Column
                header="Acciones"
                body={alertActions}
                style={{ width: "120px" }}
              />
            </DataTable>
          )}
        </div>
      </div>
    </Card>
  );
}
