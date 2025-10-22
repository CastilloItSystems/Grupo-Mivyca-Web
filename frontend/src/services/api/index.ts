/**
 * Punto de entrada para todos los servicios de API
 * Exporta los clientes y servicios para cada empresa del Grupo Mivyca
 */

// Cliente base
export { apiClient } from "./client";
export type { ApiResponse, PaginatedResponse, RequestConfig } from "./client";

// Importar servicios para construir el índice y el mapa dinámico
import { almivycaService } from "./almivyca";
import { transmivycaService } from "./transmivyca";
import { camabarService } from "./camabar";
import type { CompanyId } from "@/types";

// Exportar los servicios individualmente (útil para imports directos)
export { almivycaService, transmivycaService, camabarService };

// Objeto de servicios para acceso dinámico
export const services = {
  almivyca: almivycaService,
  transmivyca: transmivycaService,
  camabar: camabarService,
} as const;

/**
 * Obtiene el servicio correspondiente a una empresa específica
 */
export function getServiceByCompany(companyId: CompanyId) {
  return services[companyId];
}

/**
 * Tipos de utilidad para los servicios
 */
export type ServiceType = typeof services;
export type ServiceKeys = keyof ServiceType;
