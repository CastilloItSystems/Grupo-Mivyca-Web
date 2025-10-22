/**
 * Servicio para la gestión de inventario de Almivyca
 * Conecta con los endpoints del backend para productos, stock, y reportes
 */

import { apiClient, type ApiResponse, type PaginatedResponse } from "./client";
import type {
  Product,
  ProductCategory,
  StockMovement,
  InventoryAlert,
  InventoryReport,
  InventoryStats,
  CreateProductData,
  UpdateProductData,
  StockMovementData,
  ProductFilters,
  StockMovementFilters,
} from "@/types";

class AlmivycaService {
  private readonly basePath = "/api/almivyca";

  // === GESTIÓN DE PRODUCTOS ===
  async getProducts(
    params: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> {
    return apiClient.getPaginated<Product>(`${this.basePath}/products`, params);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<ApiResponse<Product>>(
      `${this.basePath}/products/${id}`
    );
  }

  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    return apiClient.post<ApiResponse<Product>>(
      `${this.basePath}/products`,
      data
    );
  }

  async updateProduct(
    id: string,
    data: UpdateProductData
  ): Promise<ApiResponse<Product>> {
    return apiClient.put<ApiResponse<Product>>(
      `${this.basePath}/products/${id}`,
      data
    );
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(
      `${this.basePath}/products/${id}`
    );
  }

  async searchProducts(
    query: string,
    filters?: ProductFilters
  ): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams({
      query,
      ...(filters as Record<string, string>),
    });
    return apiClient.get<ApiResponse<Product[]>>(
      `${this.basePath}/products/search?${params.toString()}`
    );
  }

  async getProductSuggestions(
    query: string,
    limit: number = 5
  ): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams({ query, limit: limit.toString() });
    return apiClient.get<ApiResponse<Product[]>>(
      `${this.basePath}/products/suggestions?${params.toString()}`
    );
  }

  // === GESTIÓN DE CATEGORÍAS ===
  async getProductCategories(): Promise<ApiResponse<ProductCategory[]>> {
    return apiClient.get<ApiResponse<ProductCategory[]>>(
      `${this.basePath}/categories`
    );
  }

  async createProductCategory(data: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<ProductCategory>> {
    return apiClient.post<ApiResponse<ProductCategory>>(
      `${this.basePath}/categories`,
      data
    );
  }

  async updateProductCategory(
    id: string,
    data: { name: string; description?: string }
  ): Promise<ApiResponse<ProductCategory>> {
    return apiClient.put<ApiResponse<ProductCategory>>(
      `${this.basePath}/categories/${id}`,
      data
    );
  }

  async deleteProductCategory(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(
      `${this.basePath}/categories/${id}`
    );
  }

  // === GESTIÓN DE STOCK ===
  async updateStock(
    productId: string,
    quantity: number
  ): Promise<ApiResponse<Product>> {
    return apiClient.post<ApiResponse<Product>>(
      `${this.basePath}/products/${productId}/stock`,
      {
        quantity,
      }
    );
  }

  async adjustStock(
    productId: string,
    newQuantity: number,
    reason?: string
  ): Promise<ApiResponse<Product>> {
    return apiClient.post<ApiResponse<Product>>(
      `${this.basePath}/products/${productId}/adjust-stock`,
      {
        newQuantity,
        reason,
      }
    );
  }

  async getStockMovements(
    params: StockMovementFilters = {}
  ): Promise<PaginatedResponse<StockMovement>> {
    return apiClient.getPaginated<StockMovement>(
      `${this.basePath}/stock-movements`,
      params
    );
  }

  async createStockMovement(
    data: StockMovementData
  ): Promise<ApiResponse<StockMovement>> {
    return apiClient.post<ApiResponse<StockMovement>>(
      `${this.basePath}/stock-movements`,
      data
    );
  }

  // === REPORTES ===
  async getInventoryReport(
    params: Record<string, any> = {}
  ): Promise<ApiResponse<InventoryReport>> {
    const queryParams = new URLSearchParams(params);
    return apiClient.get<ApiResponse<InventoryReport>>(
      `${this.basePath}/reports/inventory?${queryParams.toString()}`
    );
  }

  async getLowStockReport(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<ApiResponse<Product[]>>(
      `${this.basePath}/reports/low-stock`
    );
  }

  async getMovementReport(
    startDate: string,
    endDate: string,
    productId?: string
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({ startDate, endDate });
    if (productId) params.append("productId", productId);
    return apiClient.get<ApiResponse<any>>(
      `${this.basePath}/reports/movements?${params.toString()}`
    );
  }

  async exportInventory(
    format: "excel" | "pdf" = "excel",
    filters?: ProductFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...(filters as Record<string, string>),
    });
    const response = await fetch(
      `${this.basePath}/export/inventory?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.blob();
  }

  // === ESTADÍSTICAS ===
  async getInventoryStats(): Promise<ApiResponse<InventoryStats>> {
    return apiClient.get<ApiResponse<InventoryStats>>(`${this.basePath}/stats`);
  }

  // === ALERTAS ===
  async getInventoryAlerts(): Promise<PaginatedResponse<InventoryAlert>> {
    return apiClient.getPaginated<InventoryAlert>(`${this.basePath}/alerts`);
  }

  async markAlertAsRead(alertId: string): Promise<ApiResponse<InventoryAlert>> {
    return apiClient.post<ApiResponse<InventoryAlert>>(
      `${this.basePath}/alerts/${alertId}/read`
    );
  }

  async dismissAlert(alertId: string): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(
      `${this.basePath}/alerts/${alertId}/dismiss`
    );
  }
}

// Exportar instancia singleton
export const almivycaService = new AlmivycaService();
export default almivycaService;
