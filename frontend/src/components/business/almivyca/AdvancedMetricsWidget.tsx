"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Knob } from "primereact/knob";
import { ProgressBar } from "primereact/progressbar";
import { useState, useEffect } from "react";

interface MetricData {
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  color: string;
  icon: string;
}

export function AdvancedMetricsWidget() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setMetrics(getMockMetrics());
    setChartData(getRotationChartData());
    setChartOptions(getChartOptions());
  }, []);

  const formatValue = (value: number, unit: string) => {
    if (unit === "%") return `${value}${unit}`;
    if (unit === "$") return `$${value.toLocaleString()}`;
    if (unit === "días") return `${value} ${unit}`;
    return `${value.toLocaleString()} ${unit}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Métricas principales con knobs */}
      <Card title="📊 Métricas de Rendimiento" className="h-full">
        <div className="grid grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="mb-3">
                <i
                  className={`pi pi-${metric.icon} text-2xl mb-2`}
                  style={{ color: metric.color }}
                />
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  {metric.title}
                </h4>
              </div>

              <Knob
                value={metric.value}
                max={metric.target}
                size={80}
                valueColor={metric.color}
                rangeColor="#e5e7eb"
                textColor="#374151"
                strokeWidth={8}
                showValue={false}
                className="mb-2"
              />

              <div
                className="text-lg font-bold mb-1"
                style={{ color: metric.color }}
              >
                {formatValue(metric.value, metric.unit)}
              </div>

              <div className="text-xs text-gray-500 mb-2">
                Meta: {formatValue(metric.target, metric.unit)}
              </div>

              <div
                className={`text-xs flex items-center justify-center gap-1 ${
                  metric.trend > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <i
                  className={`pi pi-arrow-${metric.trend > 0 ? "up" : "down"}`}
                />
                {Math.abs(metric.trend)}% vs mes anterior
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rotación de inventario */}
      <Card title="🔄 Rotación de Inventario por Categoría" className="h-full">
        <Chart
          type="radar"
          data={chartData}
          options={chartOptions}
          className="w-full h-64"
        />

        <div className="mt-4 space-y-2">
          {getInventoryCategories().map((category, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm font-medium">{category.name}</span>
              <div className="flex items-center gap-2">
                <ProgressBar
                  value={category.rotation}
                  className="w-24 h-2"
                  color={
                    category.rotation > 70
                      ? "#10b981"
                      : category.rotation > 40
                        ? "#f59e0b"
                        : "#ef4444"
                  }
                />
                <span className="text-xs text-gray-600 w-12">
                  {category.rotation}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function getMockMetrics(): MetricData[] {
  return [
    {
      title: "Nivel de Servicio",
      value: 94,
      target: 100,
      unit: "%",
      trend: 2.5,
      color: "#10b981",
      icon: "check-circle",
    },
    {
      title: "Rotación Promedio",
      value: 12.5,
      target: 15,
      unit: "días",
      trend: -1.2,
      color: "#3b82f6",
      icon: "refresh",
    },
    {
      title: "Valor en Riesgo",
      value: 15500,
      target: 50000,
      unit: "$",
      trend: -8.3,
      color: "#ef4444",
      icon: "exclamation-triangle",
    },
    {
      title: "Eficiencia Almacén",
      value: 87,
      target: 100,
      unit: "%",
      trend: 5.7,
      color: "#8b5cf6",
      icon: "cog",
    },
  ];
}

function getRotationChartData() {
  return {
    labels: ["Electrónicos", "Accesorios", "Oficina", "Audio/Video", "Gaming"],
    datasets: [
      {
        label: "Rotación Actual",
        data: [85, 92, 78, 95, 88],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
      },
      {
        label: "Meta Esperada",
        data: [90, 95, 85, 98, 92],
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "#10b981",
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: "#10b981",
      },
    ],
  };
}

function getChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: "#e5e7eb",
        },
        angleLines: {
          color: "#e5e7eb",
        },
      },
    },
  };
}

function getInventoryCategories() {
  return [
    { name: "Electrónicos", rotation: 85 },
    { name: "Accesorios", rotation: 92 },
    { name: "Oficina", rotation: 78 },
    { name: "Audio/Video", rotation: 95 },
    { name: "Gaming", rotation: 88 },
    { name: "Cables", rotation: 65 },
  ];
}
