"use client";

import { Skeleton } from "primereact/skeleton";
import { Card } from "primereact/card";

// Skeleton para widgets del dashboard
export function DashboardWidgetSkeleton() {
  return (
    <Card className="h-full">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton width="150px" height="24px" />
          <Skeleton shape="circle" size="32px" />
        </div>
        <div className="space-y-3">
          <Skeleton width="100%" height="60px" />
          <div className="flex justify-between">
            <Skeleton width="45%" height="20px" />
            <Skeleton width="45%" height="20px" />
          </div>
          <Skeleton width="80%" height="16px" />
        </div>
      </div>
    </Card>
  );
}

// Skeleton para listas de productos/items
export function ListItemSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center p-3 border rounded">
          <Skeleton shape="circle" size="48px" className="mr-3" />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height="18px" />
            <Skeleton width="45%" height="14px" />
          </div>
          <Skeleton width="80px" height="32px" />
        </div>
      ))}
    </div>
  );
}

// Skeleton para tablas
export function TableSkeleton({
  rows = 8,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex space-x-2 p-3 bg-gray-50 rounded">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} width="100%" height="20px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2 p-3 border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="100%" height="16px" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton para gráficos
export function ChartSkeleton() {
  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton width="180px" height="24px" />
          <div className="flex space-x-2">
            <Skeleton width="60px" height="32px" />
            <Skeleton width="60px" height="32px" />
          </div>
        </div>
        <div className="relative h-64">
          <Skeleton width="100%" height="100%" />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} width="40px" height="12px" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Skeleton para páginas completas
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Skeleton width="250px" height="32px" className="mb-2" />
          <Skeleton width="400px" height="18px" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <DashboardWidgetSkeleton />
          <DashboardWidgetSkeleton />
          <DashboardWidgetSkeleton />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <div>
            <Card>
              <div className="p-4">
                <Skeleton width="120px" height="20px" className="mb-4" />
                <ListItemSkeleton count={6} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading spinner con mensaje
export function LoadingSpinner({
  message = "Cargando...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
