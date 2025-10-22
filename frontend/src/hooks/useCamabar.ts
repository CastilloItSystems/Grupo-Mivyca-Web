/**
 * Hooks específicos para CAMABAR - Gestión de Restaurante
 * Proporciona interfaces de alto nivel para todas las operaciones del restaurante
 */

import { useCallback } from "react";
import { useApi, usePaginatedApi, useCrudApi } from "@/hooks/useApi";
import { camabarService } from "@/services/api";
import type { MenuItem, Order, Table, Reservation, SalesReport } from "@/types";

/**
 * Hook para gestión de menú
 */
export function useMenu() {
  const listApi = useApi(() => camabarService.getMenuItems());

  const createMenuItem = useApi((data: any) =>
    camabarService.createMenuItem(data)
  );
  const updateMenuItem = useApi((id: string, data: any) =>
    camabarService.updateMenuItem(id, data)
  );
  const deleteMenuItem = useApi((id: string) =>
    camabarService.deleteMenuItem(id)
  );

  const createAndRefresh = useCallback(
    async (data: any) => {
      try {
        const result = await createMenuItem.execute(data);
        await listApi.execute();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createMenuItem, listApi]
  );

  const updateAndRefresh = useCallback(
    async (id: string, data: any) => {
      try {
        const result = await updateMenuItem.execute(id, data);
        await listApi.execute();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateMenuItem, listApi]
  );

  const deleteAndRefresh = useCallback(
    async (id: string) => {
      try {
        await deleteMenuItem.execute(id);
        await listApi.execute();
      } catch (error) {
        throw error;
      }
    },
    [deleteMenuItem, listApi]
  );

  return {
    list: listApi,
    create: {
      ...createMenuItem,
      execute: createAndRefresh,
    },
    update: {
      ...updateMenuItem,
      execute: updateAndRefresh,
    },
    delete: {
      ...deleteMenuItem,
      execute: deleteAndRefresh,
    },
  };
}

/**
 * Hook para obtener un item del menú específico
 */
export function useMenuItem(id: string) {
  return useApi(() => camabarService.getMenuItem(id), !!id);
}

/**
 * Hook para gestión de órdenes
 */
export function useOrders() {
  const listApi = usePaginatedApi((params: Record<string, any> = {}) =>
    camabarService.getOrders(params)
  );

  const createOrder = useApi((data: any) => camabarService.createOrder(data));
  const updateOrder = useApi((id: string, data: any) =>
    camabarService.updateOrder(id, data)
  );
  const updateOrderStatus = useApi(
    (
      id: string,
      status:
        | "PENDING"
        | "CONFIRMED"
        | "PREPARING"
        | "READY"
        | "SERVED"
        | "PAID"
        | "CANCELLED"
    ) => camabarService.updateOrderStatus(id, status)
  );

  const createAndRefresh = useCallback(
    async (data: any) => {
      try {
        const result = await createOrder.execute(data);
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createOrder, listApi]
  );

  const updateAndRefresh = useCallback(
    async (id: string, data: any) => {
      try {
        const result = await updateOrder.execute(id, data);
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateOrder, listApi]
  );

  const updateStatusAndRefresh = useCallback(
    async (
      id: string,
      status:
        | "PENDING"
        | "CONFIRMED"
        | "PREPARING"
        | "READY"
        | "SERVED"
        | "PAID"
        | "CANCELLED"
    ) => {
      try {
        const result = await updateOrderStatus.execute(id, status);
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateOrderStatus, listApi]
  );

  return {
    list: listApi,
    create: {
      ...createOrder,
      execute: createAndRefresh,
    },
    update: {
      ...updateOrder,
      execute: updateAndRefresh,
    },
    updateStatus: {
      ...updateOrderStatus,
      execute: updateStatusAndRefresh,
    },
  };
}

/**
 * Hook para obtener una orden específica
 */
export function useOrder(id: string) {
  return useApi(() => camabarService.getOrder(id), !!id);
}

/**
 * Hook para gestión de mesas
 */
export function useTables() {
  const listApi = useApi(() => camabarService.getTables());

  const updateTableStatus = useApi(
    (id: string, status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING") =>
      camabarService.updateTableStatus(id, status)
  );

  const updateStatusAndRefresh = useCallback(
    async (
      id: string,
      status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING"
    ) => {
      try {
        const result = await updateTableStatus.execute(id, status);
        await listApi.execute();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateTableStatus, listApi]
  );

  return {
    list: listApi,
    updateStatus: {
      ...updateTableStatus,
      execute: updateStatusAndRefresh,
    },
  };
}

/**
 * Hook para obtener mesas disponibles
 */
export function useAvailableTables() {
  return useApi(() => camabarService.getAvailableTables(), true);
}

/**
 * Hook para gestión de reservaciones
 */
export function useReservations() {
  return useCrudApi(
    (params: Record<string, any> = {}) =>
      camabarService.getReservations(params),
    (data: any) => camabarService.createReservation(data),
    (id: string, data: any) => camabarService.updateReservation(id, data),
    (id: string) => camabarService.deleteReservation(id)
  );
}

/**
 * Hook para gestión de estado de reservaciones
 */
export function useReservationStatus() {
  const updateStatus = useApi(
    (
      reservationId: string,
      status: "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
    ) => camabarService.updateReservationStatus(reservationId, status)
  );

  const confirmReservation = useApi((reservationId: string) =>
    camabarService.confirmReservation(reservationId)
  );

  const cancelReservation = useApi((reservationId: string, reason?: string) =>
    camabarService.cancelReservation(reservationId, reason)
  );

  return {
    updateStatus,
    confirm: confirmReservation,
    cancel: cancelReservation,
  };
}

/**
 * Hook para procesamiento de pagos
 */
export function usePayments() {
  const processPayment = useApi((orderId: string, paymentData: any) =>
    camabarService.processPayment(orderId, paymentData)
  );

  const refundPayment = useApi(
    (orderId: string, amount?: number, reason?: string) =>
      camabarService.refundPayment(orderId, amount, reason)
  );

  return {
    processPayment,
    refundPayment,
  };
}

/**
 * Hook para reportes de ventas
 */
export function useSalesReports() {
  const getDailySalesReport = useApi((date?: string) =>
    camabarService.getDailySalesReport(date)
  );

  const getWeeklySalesReport = useApi((startDate?: string, endDate?: string) =>
    camabarService.getWeeklySalesReport(startDate, endDate)
  );

  const getMonthlySalesReport = useApi((month?: number, year?: number) =>
    camabarService.getMonthlySalesReport(month, year)
  );

  const getCustomReport = useApi((params: Record<string, any>) =>
    camabarService.getCustomSalesReport(params)
  );

  return {
    getDailySalesReport,
    getWeeklySalesReport,
    getMonthlySalesReport,
    getCustomReport,
  };
}

/**
 * Hook para estadísticas del restaurante
 */
export function useRestaurantStats() {
  return useApi(() => camabarService.getRestaurantStats(), true);
}

/**
 * Hook para gestión de inventario de cocina
 */
export function useKitchenInventory() {
  const getInventory = usePaginatedApi((params: Record<string, any> = {}) =>
    camabarService.getKitchenInventory(params)
  );

  const updateInventory = useApi((itemId: string, quantity: number) =>
    camabarService.updateKitchenInventory(itemId, quantity)
  );

  const getLowStockItems = useApi(() => camabarService.getLowStockItems());

  return {
    inventory: getInventory,
    updateInventory,
    getLowStockItems,
  };
}

/**
 * Hook para gestión de la cola de cocina
 */
export function useKitchenQueue() {
  const getQueue = useApi(() => camabarService.getKitchenQueue(), true);

  const updateOrderQueue = useApi(
    (orderId: string, status: string, estimatedTime?: number) =>
      camabarService.updateOrderInQueue(orderId, status, estimatedTime)
  );

  const refreshQueue = useCallback(async () => {
    await getQueue.execute();
  }, [getQueue]);

  return {
    queue: getQueue,
    updateOrderQueue,
    refreshQueue,
  };
}

/**
 * Hook para análisis de menú
 */
export function useMenuAnalytics() {
  const getPopularItems = useApi((period?: string) =>
    camabarService.getPopularMenuItems(period)
  );

  const getItemPerformance = useApi((itemId: string, period?: string) =>
    camabarService.getMenuItemPerformance(itemId, period)
  );

  const getCategoryPerformance = useApi((period?: string) =>
    camabarService.getCategoryPerformance(period)
  );

  return {
    getPopularItems,
    getItemPerformance,
    getCategoryPerformance,
  };
}

/**
 * Hook compuesto para dashboard de CAMABAR
 */
export function useCamabarDashboard() {
  const stats = useRestaurantStats();
  const availableTables = useAvailableTables();
  const kitchenQueue = useKitchenQueue();
  const dailySales = useSalesReports().getDailySalesReport;

  const refreshAll = useCallback(async () => {
    await Promise.all([
      stats.execute(),
      availableTables.execute(),
      kitchenQueue.refreshQueue(),
      dailySales.execute(),
    ]);
  }, [stats, availableTables, kitchenQueue.refreshQueue, dailySales]);

  return {
    stats,
    availableTables,
    kitchenQueue: kitchenQueue.queue,
    dailySales,
    refreshAll,
    loading:
      stats.loading ||
      availableTables.loading ||
      kitchenQueue.queue.loading ||
      dailySales.loading,
  };
}
