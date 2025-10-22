/**
 * Servicio para la gestión de rutas y vehículos de Transmivyca
 * Conecta con los endpoints del backend para logística y transporte
 */

import { apiClient, type ApiResponse, type PaginatedResponse } from "./client";
import type { Vehicle, Driver, Route, MaintenanceRecord } from "@/types";

class TransmivycaService {
  private readonly basePath = "/api/transmivyca";

  // === GESTIÓN DE VEHÍCULOS ===
  async getVehicles(
    params: Record<string, any> = {}
  ): Promise<PaginatedResponse<Vehicle>> {
    return apiClient.getPaginated<Vehicle>(`${this.basePath}/vehicles`, params);
  }

  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    return apiClient.get<ApiResponse<Vehicle>>(
      `${this.basePath}/vehicles/${id}`
    );
  }

  async createVehicle(data: any): Promise<ApiResponse<Vehicle>> {
    return apiClient.post<ApiResponse<Vehicle>>(
      `${this.basePath}/vehicles`,
      data
    );
  }

  async updateVehicle(id: string, data: any): Promise<ApiResponse<Vehicle>> {
    return apiClient.put<ApiResponse<Vehicle>>(
      `${this.basePath}/vehicles/${id}`,
      data
    );
  }

  async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(
      `${this.basePath}/vehicles/${id}`
    );
  }

  // === GESTIÓN DE CONDUCTORES ===
  async getDrivers(
    params: Record<string, any> = {}
  ): Promise<PaginatedResponse<Driver>> {
    return apiClient.getPaginated<Driver>(`${this.basePath}/drivers`, params);
  }

  async getDriver(id: string): Promise<ApiResponse<Driver>> {
    return apiClient.get<ApiResponse<Driver>>(`${this.basePath}/drivers/${id}`);
  }

  async createDriver(data: any): Promise<ApiResponse<Driver>> {
    return apiClient.post<ApiResponse<Driver>>(
      `${this.basePath}/drivers`,
      data
    );
  }

  async updateDriver(id: string, data: any): Promise<ApiResponse<Driver>> {
    return apiClient.put<ApiResponse<Driver>>(
      `${this.basePath}/drivers/${id}`,
      data
    );
  }

  async deleteDriver(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(
      `${this.basePath}/drivers/${id}`
    );
  }

  // === GESTIÓN DE RUTAS ===
  async getRoutes(
    params: Record<string, any> = {}
  ): Promise<PaginatedResponse<Route>> {
    return apiClient.getPaginated<Route>(`${this.basePath}/routes`, params);
  }

  async getRoute(id: string): Promise<ApiResponse<Route>> {
    return apiClient.get<ApiResponse<Route>>(`${this.basePath}/routes/${id}`);
  }

  async createRoute(data: any): Promise<ApiResponse<Route>> {
    return apiClient.post<ApiResponse<Route>>(`${this.basePath}/routes`, data);
  }

  async updateRoute(id: string, data: any): Promise<ApiResponse<Route>> {
    return apiClient.put<ApiResponse<Route>>(
      `${this.basePath}/routes/${id}`,
      data
    );
  }

  async deleteRoute(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.basePath}/routes/${id}`);
  }

  async getActiveRoutes(): Promise<ApiResponse<Route[]>> {
    return apiClient.get<ApiResponse<Route[]>>(
      `${this.basePath}/routes/active`
    );
  }

  async updateRouteProgress(
    routeId: string,
    progress: any
  ): Promise<ApiResponse<Route>> {
    return apiClient.post<ApiResponse<Route>>(
      `${this.basePath}/routes/${routeId}/progress`,
      progress
    );
  }

  async completeRoute(
    routeId: string,
    completionData?: any
  ): Promise<ApiResponse<Route>> {
    return apiClient.post<ApiResponse<Route>>(
      `${this.basePath}/routes/${routeId}/complete`,
      completionData
    );
  }

  // === GESTIÓN DE MANTENIMIENTO ===
  async getMaintenanceRecords(
    params: Record<string, any> = {}
  ): Promise<PaginatedResponse<MaintenanceRecord>> {
    return apiClient.getPaginated<MaintenanceRecord>(
      `${this.basePath}/maintenance`,
      params
    );
  }

  async getMaintenanceRecord(
    id: string
  ): Promise<ApiResponse<MaintenanceRecord>> {
    return apiClient.get<ApiResponse<MaintenanceRecord>>(
      `${this.basePath}/maintenance/${id}`
    );
  }

  async createMaintenanceRecord(
    data: any
  ): Promise<ApiResponse<MaintenanceRecord>> {
    return apiClient.post<ApiResponse<MaintenanceRecord>>(
      `${this.basePath}/maintenance`,
      data
    );
  }

  async updateMaintenanceRecord(
    id: string,
    data: any
  ): Promise<ApiResponse<MaintenanceRecord>> {
    return apiClient.put<ApiResponse<MaintenanceRecord>>(
      `${this.basePath}/maintenance/${id}`,
      data
    );
  }

  async deleteMaintenanceRecord(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(
      `${this.basePath}/maintenance/${id}`
    );
  }

  // === REPORTES ===
  async getFleetReport(
    params: Record<string, any> = {}
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params);
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/reports/fleet?${queryParams.toString()}`
    );
  }

  async getDriverReport(
    driverId?: string,
    params: Record<string, any> = {}
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params);
    const endpoint = driverId
      ? `${this.basePath}/reports/driver/${driverId}?${queryParams.toString()}`
      : `${this.basePath}/reports/drivers?${queryParams.toString()}`;
    return apiClient.get<ApiResponse<any>>(endpoint);
  }

  async getRouteReport(
    params: Record<string, any> = {}
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params);
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/reports/routes?${queryParams.toString()}`
    );
  }

  async getMaintenanceReport(
    params: Record<string, any> = {}
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params);
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/reports/maintenance?${queryParams.toString()}`
    );
  }

  async getDeliveryReport(
    params: Record<string, any> = {}
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params);
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/reports/deliveries?${queryParams.toString()}`
    );
  }

  // === ESTADÍSTICAS ===
  async getTransportStats(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/stats`);
  }

  // === ASIGNACIONES ===
  async assignDriverToVehicle(
    vehicleId: string,
    driverId: string
  ): Promise<ApiResponse<Vehicle>> {
    return apiClient.post<ApiResponse<Vehicle>>(
      `${this.basePath}/vehicles/${vehicleId}/assign-driver`,
      { driverId }
    );
  }

  async unassignDriverFromVehicle(
    vehicleId: string
  ): Promise<ApiResponse<Vehicle>> {
    return apiClient.post<ApiResponse<Vehicle>>(
      `${this.basePath}/vehicles/${vehicleId}/unassign-driver`
    );
  }

  // === TRACKING ===
  async getVehicleLocation(vehicleId: string): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/vehicles/${vehicleId}/location`
    );
  }

  async updateVehicleLocation(
    vehicleId: string,
    location: any
  ): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(
      `${this.basePath}/vehicles/${vehicleId}/location`,
      location
    );
  }

  async getRouteTracking(routeId: string): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/routes/${routeId}/tracking`
    );
  }
}

// Exportar instancia singleton
export const transmivycaService = new TransmivycaService();
export default transmivycaService;
