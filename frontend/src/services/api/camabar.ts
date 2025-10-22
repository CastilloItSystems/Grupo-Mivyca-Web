/**
 * Servicio para la gestión de restaurante CAMABAR
 * Conecta con los endpoints del backend para órdenes, menú, y ventas
 */

import { apiClient, type ApiResponse, type PaginatedResponse } from "./client";
import type { MenuItem, Order, Table, Reservation, SalesReport } from "@/types";

class CamabarService {
  private readonly basePath = "/api/camabar";

  // === GESTIÓN DE MENÚ ===
  async getMenuItems(
    params: Record<string, any> = {}
  ): Promise<ApiResponse<MenuItem[]>> {
    const queryParams = new URLSearchParams(params);
    return apiClient.get<ApiResponse<MenuItem[]>>(
      `${this.basePath}/menu?${queryParams.toString()}`
    );
  }

  async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    return apiClient.get<ApiResponse<MenuItem>>(`${this.basePath}/menu/${id}`);
  }

  async createMenuItem(data: any): Promise<ApiResponse<MenuItem>> {
    return apiClient.post<ApiResponse<MenuItem>>(`${this.basePath}/menu`, data);
  }

  async updateMenuItem(id: string, data: any): Promise<ApiResponse<MenuItem>> {
    return apiClient.put<ApiResponse<MenuItem>>(
      `${this.basePath}/menu/${id}`,
      data
    );
  }

  async deleteMenuItem(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.basePath}/menu/${id}`);
  }

  async getMenuCategories(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(
      `${this.basePath}/menu/categories`
    );
  }

  // === GESTIÓN DE ÓRDENES ===
  async getOrders(
    params: Record<string, any> = {}
  ): Promise<PaginatedResponse<Order>> {
    return apiClient.getPaginated<Order>(`${this.basePath}/orders`, params);
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(`${this.basePath}/orders/${id}`);
  }

  async createOrder(data: any): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>(`${this.basePath}/orders`, data);
  }

  async updateOrder(id: string, data: any): Promise<ApiResponse<Order>> {
    return apiClient.put<ApiResponse<Order>>(
      `${this.basePath}/orders/${id}`,
      data
    );
  }

  async updateOrderStatus(
    id: string,
    status:
      | "PENDING"
      | "CONFIRMED"
      | "PREPARING"
      | "READY"
      | "SERVED"
      | "PAID"
      | "CANCELLED"
  ): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>(
      `${this.basePath}/orders/${id}/status`,
      { status }
    );
  }

  async getActiveOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(
      `${this.basePath}/orders/active`
    );
  }

  // === GESTIÓN DE MESAS ===
  async getTables(): Promise<ApiResponse<Table[]>> {
    return apiClient.get<ApiResponse<Table[]>>(`${this.basePath}/tables`);
  }

  async getTable(id: string): Promise<ApiResponse<Table>> {
    return apiClient.get<ApiResponse<Table>>(`${this.basePath}/tables/${id}`);
  }

  async updateTableStatus(
    id: string,
    status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING"
  ): Promise<ApiResponse<Table>> {
    return apiClient.post<ApiResponse<Table>>(
      `${this.basePath}/tables/${id}/status`,
      { status }
    );
  }

  async getAvailableTables(): Promise<ApiResponse<Table[]>> {
    return apiClient.get<ApiResponse<Table[]>>(
      `${this.basePath}/tables/available`
    );
  }

  // === GESTIÓN DE RESERVACIONES ===
  async getReservations(
    params: Record<string, any> = {}
  ): Promise<PaginatedResponse<Reservation>> {
    return apiClient.getPaginated<Reservation>(
      `${this.basePath}/reservations`,
      params
    );
  }

  async getReservation(id: string): Promise<ApiResponse<Reservation>> {
    return apiClient.get<ApiResponse<Reservation>>(
      `${this.basePath}/reservations/${id}`
    );
  }

  async createReservation(data: any): Promise<ApiResponse<Reservation>> {
    return apiClient.post<ApiResponse<Reservation>>(
      `${this.basePath}/reservations`,
      data
    );
  }

  async updateReservation(
    id: string,
    data: any
  ): Promise<ApiResponse<Reservation>> {
    return apiClient.put<ApiResponse<Reservation>>(
      `${this.basePath}/reservations/${id}`,
      data
    );
  }

  async deleteReservation(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(
      `${this.basePath}/reservations/${id}`
    );
  }

  async updateReservationStatus(
    id: string,
    status: "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  ): Promise<ApiResponse<Reservation>> {
    return apiClient.post<ApiResponse<Reservation>>(
      `${this.basePath}/reservations/${id}/status`,
      { status }
    );
  }

  async confirmReservation(id: string): Promise<ApiResponse<Reservation>> {
    return apiClient.post<ApiResponse<Reservation>>(
      `${this.basePath}/reservations/${id}/confirm`
    );
  }

  async cancelReservation(
    id: string,
    reason?: string
  ): Promise<ApiResponse<Reservation>> {
    return apiClient.post<ApiResponse<Reservation>>(
      `${this.basePath}/reservations/${id}/cancel`,
      { reason }
    );
  }

  // === PAGOS ===
  async processPayment(
    orderId: string,
    paymentData: any
  ): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(
      `${this.basePath}/orders/${orderId}/payment`,
      paymentData
    );
  }

  async refundPayment(
    orderId: string,
    amount?: number,
    reason?: string
  ): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(
      `${this.basePath}/orders/${orderId}/refund`,
      { amount, reason }
    );
  }

  // === REPORTES DE VENTAS ===
  async getDailySalesReport(date?: string): Promise<ApiResponse<SalesReport>> {
    const params = date ? `?date=${date}` : "";
    return apiClient.get<ApiResponse<SalesReport>>(
      `${this.basePath}/reports/sales/daily${params}`
    );
  }

  async getWeeklySalesReport(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/reports/sales/weekly?${params.toString()}`
    );
  }

  async getMonthlySalesReport(
    month?: number,
    year?: number
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/reports/sales/monthly?${params.toString()}`
    );
  }

  async getCustomSalesReport(
    params: Record<string, any>
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params);
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/reports/sales/custom?${queryParams.toString()}`
    );
  }

  async getSalesReport(
    params: Record<string, any> = {}
  ): Promise<ApiResponse<SalesReport>> {
    const queryParams = new URLSearchParams(params);
    return apiClient.get<ApiResponse<SalesReport>>(
      `${this.basePath}/reports/sales?${queryParams.toString()}`
    );
  }

  // === ESTADÍSTICAS ===
  async getRestaurantStats(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/stats`);
  }

  // === INVENTARIO DE COCINA ===
  async getKitchenInventory(
    params: Record<string, any> = {}
  ): Promise<PaginatedResponse<any>> {
    return apiClient.getPaginated<any>(
      `${this.basePath}/kitchen/inventory`,
      params
    );
  }

  async updateKitchenInventory(
    itemId: string,
    quantity: number
  ): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(
      `${this.basePath}/kitchen/inventory/${itemId}`,
      { quantity }
    );
  }

  async getLowStockItems(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(
      `${this.basePath}/kitchen/inventory/low-stock`
    );
  }

  // === COLA DE COCINA ===
  async getKitchenQueue(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`${this.basePath}/kitchen/queue`);
  }

  async updateOrderInQueue(
    orderId: string,
    status: string,
    estimatedTime?: number
  ): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(
      `${this.basePath}/kitchen/queue/${orderId}`,
      {
        status,
        estimatedTime,
      }
    );
  }

  // === ANÁLISIS DE MENÚ ===
  async getPopularMenuItems(period?: string): Promise<ApiResponse<any[]>> {
    const params = period ? `?period=${period}` : "";
    return apiClient.get<ApiResponse<any[]>>(
      `${this.basePath}/analytics/menu/popular${params}`
    );
  }

  async getMenuItemPerformance(
    itemId: string,
    period?: string
  ): Promise<ApiResponse<any>> {
    const params = period ? `?period=${period}` : "";
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/analytics/menu/item/${itemId}${params}`
    );
  }

  async getCategoryPerformance(period?: string): Promise<ApiResponse<any[]>> {
    const params = period ? `?period=${period}` : "";
    return apiClient.get<ApiResponse<any[]>>(
      `${this.basePath}/analytics/menu/categories${params}`
    );
  }
}

// Exportar instancia singleton
export const camabarService = new CamabarService();
export default camabarService;
