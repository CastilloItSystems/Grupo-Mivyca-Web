"use client";

import React, { memo } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Chart } from "chart.js/auto";
import { useEffect, useRef } from "react";

interface OptimizedWidgetProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  loading?: boolean;
}

/**
 * Widget optimizado con React.memo
 * Solo se re-renderiza cuando sus props cambian
 */
export const OptimizedWidget = memo<OptimizedWidgetProps>(
  ({ title, value, icon, color, trend, onClick, loading = false }) => {
    return (
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${loading ? "opacity-50" : ""}`}
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : value}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: color }}
            >
              <i className={`${icon} text-lg`}></i>
            </div>
          </div>

          {trend && !loading && (
            <div className="flex items-center">
              <i
                className={`pi ${trend.isPositive ? "pi-arrow-up text-green-500" : "pi-arrow-down text-red-500"} text-xs mr-1`}
              ></i>
              <span
                className={`text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">
                vs mes anterior
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }
);

OptimizedWidget.displayName = "OptimizedWidget";

interface OptimizedChartProps {
  data: any;
  type: "line" | "bar" | "pie" | "doughnut";
  options?: any;
  height?: number;
}

/**
 * Componente de gráfico optimizado con React.memo
 * Evita re-renderizar el chart innecesariamente
 */
export const OptimizedChart = memo<OptimizedChartProps>(
  ({ data, type, options = {}, height = 300 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
      if (!canvasRef.current) return;

      // Destruir chart anterior si existe
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Crear nuevo chart
      chartRef.current = new Chart(canvasRef.current, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      });

      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
      };
    }, [data, type, options]);

    return (
      <div style={{ height: `${height}px` }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    );
  }
);

OptimizedChart.displayName = "OptimizedChart";

interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * Lista optimizada que solo re-renderiza items modificados
 */
function OptimizedListComponent<T>({
  items,
  renderItem,
  keyExtractor,
  loading = false,
  emptyMessage = "No hay elementos para mostrar",
}: OptimizedListProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <i className="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <i className="pi pi-inbox text-4xl mb-4 block"></i>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}

export const OptimizedList = memo(
  OptimizedListComponent
) as typeof OptimizedListComponent;

/**
 * HOC para optimizar componentes automáticamente
 */
export function withOptimization<P extends object>(
  Component: React.ComponentType<P>,
  customCompareFn?: (prevProps: P, nextProps: P) => boolean
) {
  const OptimizedComponent = memo(Component, customCompareFn);
  OptimizedComponent.displayName = `Optimized${Component.displayName || Component.name}`;
  return OptimizedComponent;
}
