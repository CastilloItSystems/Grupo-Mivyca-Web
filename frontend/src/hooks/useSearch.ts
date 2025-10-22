"use client";

import { useState, useDeferredValue, useMemo, useCallback } from "react";

interface UseSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
}

/**
 * Hook para búsqueda optimizada usando React 18 useDeferredValue
 * Permite búsquedas en tiempo real sin bloquear la UI
 */
export function useSearch<T>({
  data,
  searchFields,
  debounceMs = 300,
}: UseSearchProps<T>) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // Filtros adicionales opcionales
  const [filters, setFilters] = useState<Record<string, any>>({});
  const deferredFilters = useDeferredValue(filters);

  // Resultados filtrados usando la query diferida
  const filteredData = useMemo(() => {
    if (!deferredQuery.trim() && Object.keys(deferredFilters).length === 0) {
      return data;
    }

    return data.filter((item) => {
      // Filtro por texto de búsqueda
      const matchesQuery =
        !deferredQuery.trim() ||
        searchFields.some((field) => {
          const value = item[field];
          if (typeof value === "string") {
            return value.toLowerCase().includes(deferredQuery.toLowerCase());
          }
          if (typeof value === "number") {
            return value.toString().includes(deferredQuery);
          }
          return false;
        });

      // Filtros adicionales
      const matchesFilters = Object.entries(deferredFilters).every(
        ([key, filterValue]) => {
          if (!filterValue) return true;
          const itemValue = (item as any)[key];

          if (Array.isArray(filterValue)) {
            return filterValue.includes(itemValue);
          }

          return itemValue === filterValue;
        }
      );

      return matchesQuery && matchesFilters;
    });
  }, [data, deferredQuery, deferredFilters, searchFields]);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setFilters({});
  }, []);

  const isSearching =
    query !== deferredQuery ||
    JSON.stringify(filters) !== JSON.stringify(deferredFilters);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    filteredData,
    isSearching,
    hasResults: filteredData.length > 0,
    totalResults: filteredData.length,
    originalTotal: data.length,
  };
}

/**
 * Hook específico para búsqueda de productos
 */
export function useProductSearch(products: any[]) {
  return useSearch({
    data: products,
    searchFields: ["name", "code", "category", "description"],
  });
}

/**
 * Hook específico para búsqueda de vehículos
 */
export function useVehicleSearch(vehicles: any[]) {
  return useSearch({
    data: vehicles,
    searchFields: ["plate", "model", "brand", "driver"],
  });
}

/**
 * Hook específico para búsqueda de órdenes/pedidos
 */
export function useOrderSearch(orders: any[]) {
  return useSearch({
    data: orders,
    searchFields: ["id", "customerName", "status", "items"],
  });
}
