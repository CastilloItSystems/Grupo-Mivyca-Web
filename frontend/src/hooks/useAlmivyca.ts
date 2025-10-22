/**
 * Hooks específicos para Almivyca - Gestión de Inventario
 * Proporciona interfaces de alto nivel para todas las operaciones de inventario
 */

import { useCallback } from "react";
import { useApi, usePaginatedApi, useCrudApi } from "@/hooks/useApi";
import { almivycaService } from "@/services/api";
import type {
  Product,
  StockMovement,
  InventoryReport,
  InventoryAlert,
  CreateProductData,
  UpdateProductData,
  StockMovementData,
  ProductFilters,
  StockMovementFilters,
} from "@/types";

/**
 * Hook para gestión de productos
 */
export function useProducts() {
  return useCrudApi<import("@/types").Product>(
    (params: ProductFilters = {}) => almivycaService.getProducts(params),
    (data: CreateProductData) => almivycaService.createProduct(data),
    (id: string, data: UpdateProductData) =>
      almivycaService.updateProduct(id, data),
    (id: string) => almivycaService.deleteProduct(id)
  );
}

/**
 * Hook para obtener un producto específico
 */
export function useProduct(id: string) {
  return useApi(
    () => almivycaService.getProduct(id),
    !!id // Solo ejecutar si hay ID
  );
}

/**
 * Hook para gestión de movimientos de stock
 */
export function useStockMovements() {
  const listApi = usePaginatedApi((params: StockMovementFilters = {}) =>
    almivycaService.getStockMovements(params)
  );

  const createMovement = useApi<import("@/types").StockMovement>(
    (data: StockMovementData) => almivycaService.createStockMovement(data)
  );

  const executeMovement = useCallback(
    async (data: StockMovementData) => {
      try {
        const result = await createMovement.execute(data);
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createMovement, listApi]
  );

  return {
    list: listApi,
    create: {
      ...createMovement,
      execute: executeMovement,
    },
  };
}

/**
 * Hook para actualización de stock
 */
export function useStockUpdate() {
  const updateStock = useApi<import("@/types").Product>(
    (productId: string, quantity: number) =>
      almivycaService.updateStock(productId, quantity)
  );

  const adjustStock = useApi<import("@/types").Product>(
    (productId: string, newQuantity: number, reason?: string) =>
      almivycaService.adjustStock(productId, newQuantity, reason)
  );

  return {
    update: updateStock,
    adjust: adjustStock,
  };
}

/**
 * Hook para reportes de inventario
 */
export function useInventoryReports() {
  const getReport = useApi<import("@/types").InventoryReport>(
    (params: Record<string, any> = {}) =>
      almivycaService.getInventoryReport(params)
  );

  const getLowStockReport = useApi<import("@/types").Product[]>(() =>
    almivycaService.getLowStockReport()
  );

  const getMovementReport = useApi<any>(
    (startDate: string, endDate: string, productId?: string) =>
      almivycaService.getMovementReport(startDate, endDate, productId)
  );

  const exportInventory = useCallback(
    (format: "excel" | "pdf" = "excel", filters?: ProductFilters) =>
      almivycaService.exportInventory(format, filters),
    []
  );

  return {
    getReport,
    getLowStockReport,
    getMovementReport,
    exportInventory,
  };
}

/**
 * Hook para alertas de inventario
 */
export function useInventoryAlerts() {
  const getAlerts = usePaginatedApi<import("@/types").InventoryAlert>(() =>
    almivycaService.getInventoryAlerts()
  );

  const markAsRead = useApi<import("@/types").InventoryAlert>(
    (alertId: string) => almivycaService.markAlertAsRead(alertId)
  );

  const dismissAlert = useApi<void>((alertId: string) =>
    almivycaService.dismissAlert(alertId)
  );

  const markAsReadAndRefresh = useCallback(
    async (alertId: string) => {
      try {
        await markAsRead.execute(alertId);
        await getAlerts.refresh();
      } catch (error) {
        throw error;
      }
    },
    [markAsRead, getAlerts]
  );

  const dismissAndRefresh = useCallback(
    async (alertId: string) => {
      try {
        await dismissAlert.execute(alertId);
        await getAlerts.refresh();
      } catch (error) {
        throw error;
      }
    },
    [dismissAlert, getAlerts]
  );

  return {
    list: getAlerts,
    markAsRead: {
      ...markAsRead,
      execute: markAsReadAndRefresh,
    },
    dismiss: {
      ...dismissAlert,
      execute: dismissAndRefresh,
    },
  };
}

/**
 * Hook para obtener estadísticas de inventario
 */
export function useInventoryStats() {
  return useApi<import("@/types").InventoryStats>(
    () => almivycaService.getInventoryStats(),
    true
  );
}

/**
 * Hook para búsqueda de productos
 */
export function useProductSearch() {
  const searchProducts = useApi((query: string, filters?: ProductFilters) =>
    almivycaService.searchProducts(query, filters)
  );

  const getProductSuggestions = useApi((query: string, limit: number = 5) =>
    almivycaService.getProductSuggestions(query, limit)
  );

  return {
    search: searchProducts,
    suggestions: getProductSuggestions,
  };
}

/**
 * Hook para gestión de categorías de productos
 */
export function useProductCategories() {
  const getCategories = useApi(
    () => almivycaService.getProductCategories(),
    true
  );

  const createCategory = useApi(
    (data: { name: string; description?: string }) =>
      almivycaService.createProductCategory(data)
  );

  const updateCategory = useApi(
    (id: string, data: { name: string; description?: string }) =>
      almivycaService.updateProductCategory(id, data)
  );

  const deleteCategory = useApi((id: string) =>
    almivycaService.deleteProductCategory(id)
  );

  const createAndRefresh = useCallback(
    async (data: { name: string; description?: string }) => {
      try {
        const result = await createCategory.execute(data);
        await getCategories.execute();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createCategory, getCategories]
  );

  const updateAndRefresh = useCallback(
    async (id: string, data: { name: string; description?: string }) => {
      try {
        const result = await updateCategory.execute(id, data);
        await getCategories.execute();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateCategory, getCategories]
  );

  const deleteAndRefresh = useCallback(
    async (id: string) => {
      try {
        await deleteCategory.execute(id);
        await getCategories.execute();
      } catch (error) {
        throw error;
      }
    },
    [deleteCategory, getCategories]
  );

  return {
    list: getCategories,
    create: {
      ...createCategory,
      execute: createAndRefresh,
    },
    update: {
      ...updateCategory,
      execute: updateAndRefresh,
    },
    delete: {
      ...deleteCategory,
      execute: deleteAndRefresh,
    },
  };
}

/**
 * Hook compuesto para dashboard de Almivyca
 */
export function useAlmivycaDashboard() {
  const stats = useInventoryStats();
  const alerts = useInventoryAlerts();
  const lowStockReport = useInventoryReports().getLowStockReport;

  const refreshAll = useCallback(async () => {
    await Promise.all([
      stats.execute(),
      alerts.list.refresh(),
      lowStockReport.execute(),
    ]);
  }, [stats, alerts.list, lowStockReport]);

  return {
    stats,
    alerts: alerts.list,
    lowStockReport,
    refreshAll,
    loading: stats.loading || alerts.list.loading || lowStockReport.loading,
  };
}
