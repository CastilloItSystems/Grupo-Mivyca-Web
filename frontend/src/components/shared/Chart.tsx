"use client";

import dynamic from "next/dynamic";
import type { ChartProps } from "primereact/chart";

// Importar Chart dinámicamente para evitar problemas de SSR
const Chart = dynamic(
  () => import("primereact/chart").then((mod) => mod.Chart),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        Cargando gráfico...
      </div>
    ),
  }
);

export default Chart;
