/**
 * Cliente HTTP configurado para las APIs del backend
 * Incluye interceptores para autenticación, manejo de errores y logging
 */

import { useAuthStore } from "@/stores/auth";

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: "success" | "error";
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...requestConfig } = config;

    // Configurar headers base
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(requestConfig.headers as Record<string, string>),
    };

    // Añadir token de autenticación si es requerido
    if (requiresAuth) {
      const { token } = useAuthStore.getState();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      console.log(`🔄 API Request: ${requestConfig.method || "GET"} ${url}`);

      const response = await fetch(url, {
        ...requestConfig,
        headers,
      });

      // Manejar respuestas no exitosas
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${url}`, data);

      return data;
    } catch (error) {
      console.error(`❌ API Error: ${url}`, error);
      throw this.handleError(error);
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const contentType = response.headers.get("content-type");
    let errorData: any = {};

    try {
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() };
      }
    } catch {
      errorData = { message: "Error desconocido del servidor" };
    }

    // Manejar diferentes tipos de error HTTP
    switch (response.status) {
      case 401:
        // Token expirado o inválido - logout automático
        useAuthStore.getState().logout();
        throw new Error(
          "Sesión expirada. Por favor, inicia sesión nuevamente."
        );

      case 403:
        throw new Error("No tienes permisos para realizar esta acción.");

      case 404:
        throw new Error("Recurso no encontrado.");

      case 422:
        throw new Error(errorData.message || "Datos de entrada inválidos.");

      case 429:
        throw new Error(
          "Demasiadas solicitudes. Intenta nuevamente más tarde."
        );

      case 500:
        throw new Error(
          "Error interno del servidor. Intenta nuevamente más tarde."
        );

      default:
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === "string") {
      return new Error(error);
    }

    return new Error("Error de conexión. Verifica tu conexión a internet.");
  }

  // Métodos HTTP principales
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "GET",
      ...config,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "DELETE",
      ...config,
    });
  }

  // Métodos de conveniencia para respuestas paginadas
  async getPaginated<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: RequestConfig
  ): Promise<PaginatedResponse<T>> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.get<PaginatedResponse<T>>(`${endpoint}${queryString}`, config);
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient(API_BASE_URL);

// Tipos exportados para uso en otros servicios
export type { ApiResponse, PaginatedResponse, RequestConfig };
