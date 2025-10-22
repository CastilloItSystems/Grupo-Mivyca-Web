/**
 * Hooks específicos para Transmivyca - Gestión de Logística y Transporte
 * Proporciona interfaces de alto nivel para todas las operaciones de transporte
 */

import { useCallback } from "react";
import { useApi, usePaginatedApi, useCrudApi } from "@/hooks/useApi";
import { transmivycaService } from "@/services/api";
import type { Vehicle, Driver, Route, MaintenanceRecord } from "@/types";

/**
 * Hook para gestión de vehículos
 */
export function useVehicles() {
  return useCrudApi(
    (params: Record<string, any> = {}) =>
      transmivycaService.getVehicles(params),
    (data: any) => transmivycaService.createVehicle(data),
    (id: string, data: any) => transmivycaService.updateVehicle(id, data),
    (id: string) => transmivycaService.deleteVehicle(id)
  );
}

/**
 * Hook para obtener un vehículo específico
 */
export function useVehicle(id: string) {
  return useApi(() => transmivycaService.getVehicle(id), !!id);
}

/**
 * Hook para gestión de conductores
 */
export function useDrivers() {
  return useCrudApi(
    (params: Record<string, any> = {}) => transmivycaService.getDrivers(params),
    (data: any) => transmivycaService.createDriver(data),
    (id: string, data: any) => transmivycaService.updateDriver(id, data),
    (id: string) => transmivycaService.deleteDriver(id)
  );
}

/**
 * Hook para obtener un conductor específico
 */
export function useDriver(id: string) {
  return useApi(() => transmivycaService.getDriver(id), !!id);
}

/**
 * Hook para gestión de rutas
 */
export function useRoutes() {
  const listApi = usePaginatedApi((params: Record<string, any> = {}) =>
    transmivycaService.getRoutes(params)
  );

  const createRoute = useApi((data: any) =>
    transmivycaService.createRoute(data)
  );
  const updateRoute = useApi((id: string, data: any) =>
    transmivycaService.updateRoute(id, data)
  );
  const deleteRoute = useApi((id: string) =>
    transmivycaService.deleteRoute(id)
  );

  const createAndRefresh = useCallback(
    async (data: any) => {
      try {
        const result = await createRoute.execute(data);
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createRoute, listApi]
  );

  const updateAndRefresh = useCallback(
    async (id: string, data: any) => {
      try {
        const result = await updateRoute.execute(id, data);
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateRoute, listApi]
  );

  const deleteAndRefresh = useCallback(
    async (id: string) => {
      try {
        await deleteRoute.execute(id);
        await listApi.refresh();
      } catch (error) {
        throw error;
      }
    },
    [deleteRoute, listApi]
  );

  return {
    list: listApi,
    create: {
      ...createRoute,
      execute: createAndRefresh,
    },
    update: {
      ...updateRoute,
      execute: updateAndRefresh,
    },
    delete: {
      ...deleteRoute,
      execute: deleteAndRefresh,
    },
  };
}

/**
 * Hook para rutas activas
 */
export function useActiveRoutes() {
  return useApi(() => transmivycaService.getActiveRoutes(), true);
}

/**
 * Hook para actualización de progreso de rutas
 */
export function useRouteProgress() {
  const updateProgress = useApi((routeId: string, progress: any) =>
    transmivycaService.updateRouteProgress(routeId, progress)
  );

  const completeRoute = useApi((routeId: string, completionData?: any) =>
    transmivycaService.completeRoute(routeId, completionData)
  );

  return {
    updateProgress,
    completeRoute,
  };
}

/**
 * Hook para gestión de mantenimiento
 */
export function useMaintenance() {
  const listApi = usePaginatedApi((params: Record<string, any> = {}) =>
    transmivycaService.getMaintenanceRecords(params)
  );

  const createRecord = useApi((data: any) =>
    transmivycaService.createMaintenanceRecord(data)
  );
  const updateRecord = useApi((id: string, data: any) =>
    transmivycaService.updateMaintenanceRecord(id, data)
  );
  const deleteRecord = useApi((id: string) =>
    transmivycaService.deleteMaintenanceRecord(id)
  );

  const createAndRefresh = useCallback(
    async (data: any) => {
      try {
        const result = await createRecord.execute(data);
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createRecord, listApi]
  );

  const updateAndRefresh = useCallback(
    async (id: string, data: any) => {
      try {
        const result = await updateRecord.execute(id, data);
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateRecord, listApi]
  );

  const deleteAndRefresh = useCallback(
    async (id: string) => {
      try {
        await deleteRecord.execute(id);
        await listApi.refresh();
      } catch (error) {
        throw error;
      }
    },
    [deleteRecord, listApi]
  );

  return {
    list: listApi,
    create: {
      ...createRecord,
      execute: createAndRefresh,
    },
    update: {
      ...updateRecord,
      execute: updateAndRefresh,
    },
    delete: {
      ...deleteRecord,
      execute: deleteAndRefresh,
    },
  };
}

/**
 * Hook para reportes de transporte
 */
export function useTransportReports() {
  const getFleetReport = useApi((params: Record<string, any> = {}) =>
    transmivycaService.getFleetReport(params)
  );

  const getDriverReport = useApi(
    (driverId?: string, params: Record<string, any> = {}) =>
      transmivycaService.getDriverReport(driverId, params)
  );

  const getRouteReport = useApi((params: Record<string, any> = {}) =>
    transmivycaService.getRouteReport(params)
  );

  const getMaintenanceReport = useApi((params: Record<string, any> = {}) =>
    transmivycaService.getMaintenanceReport(params)
  );

  return {
    getFleetReport,
    getDriverReport,
    getRouteReport,
    getMaintenanceReport,
  };
}

/**
 * Hook para estadísticas de transporte
 */
export function useTransportStats() {
  return useApi(() => transmivycaService.getTransportStats(), true);
}

/**
 * Hook para asignación de vehículos y conductores
 */
export function useVehicleAssignment() {
  const assignDriver = useApi((vehicleId: string, driverId: string) =>
    transmivycaService.assignDriverToVehicle(vehicleId, driverId)
  );

  const unassignDriver = useApi((vehicleId: string) =>
    transmivycaService.unassignDriverFromVehicle(vehicleId)
  );

  return {
    assignDriver,
    unassignDriver,
  };
}

/**
 * Hook para tracking en tiempo real
 */
export function useVehicleTracking() {
  const getVehicleLocation = useApi((vehicleId: string) =>
    transmivycaService.getVehicleLocation(vehicleId)
  );

  const updateVehicleLocation = useApi((vehicleId: string, location: any) =>
    transmivycaService.updateVehicleLocation(vehicleId, location)
  );

  const getRouteTracking = useApi((routeId: string) =>
    transmivycaService.getRouteTracking(routeId)
  );

  return {
    getVehicleLocation,
    updateVehicleLocation,
    getRouteTracking,
  };
}

/**
 * Hook compuesto para dashboard de Transmivyca
 */
export function useTransmivycaDashboard() {
  const stats = useTransportStats();
  const activeRoutes = useActiveRoutes();
  const fleetReport = useTransportReports().getFleetReport;

  const refreshAll = useCallback(async () => {
    await Promise.all([
      stats.execute(),
      activeRoutes.execute(),
      fleetReport.execute(),
    ]);
  }, [stats, activeRoutes, fleetReport]);

  return {
    stats,
    activeRoutes,
    fleetReport,
    refreshAll,
    loading: stats.loading || activeRoutes.loading || fleetReport.loading,
  };
}
