import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { TransmivycaService } from "./transmivyca.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CompanyGuard } from "../../auth/guards/company.guard";

@ApiTags("transmivyca")
@Controller("transmivyca")
@UseGuards(JwtAuthGuard, CompanyGuard)
@ApiBearerAuth()
export class TransmivycaController {
  constructor(private readonly transmivycaService: TransmivycaService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Obtener estadísticas de flota de Transmivyca" })
  @ApiResponse({
    status: 200,
    description: "Estadísticas de flota obtenidas exitosamente",
  })
  async getDashboard() {
    // Por ahora usamos un ID fijo de Transmivyca, pero debería venir del context
    const transmivycaCompanyId = "clx1234567890";
    return this.transmivycaService.getFleetStats(transmivycaCompanyId);
  }

  @Get("vehicles")
  @ApiOperation({ summary: "Obtener vehículos de Transmivyca" })
  @ApiResponse({ status: 200, description: "Vehículos obtenidos exitosamente" })
  async getVehicles() {
    // Por ahora usamos un ID fijo de Transmivyca, pero debería venir del context
    const transmivycaCompanyId = "clx1234567890";
    return this.transmivycaService.findAllVehicles(transmivycaCompanyId);
  }
}
