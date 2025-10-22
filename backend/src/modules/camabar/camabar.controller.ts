import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CamabarService } from "./camabar.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CompanyGuard } from "../../auth/guards/company.guard";

@ApiTags("camabar")
@Controller("camabar")
@UseGuards(JwtAuthGuard, CompanyGuard)
@ApiBearerAuth()
export class CamabarController {
  constructor(private readonly camabarService: CamabarService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Obtener estadísticas de pedidos de CAMABAR" })
  @ApiResponse({
    status: 200,
    description: "Estadísticas de pedidos obtenidas exitosamente",
  })
  async getDashboard() {
    // Por ahora usamos un ID fijo de CAMABAR, pero debería venir del context
    const camabarCompanyId = "clx1234567890";
    return this.camabarService.getOrderStats(camabarCompanyId);
  }

  @Get("orders")
  @ApiOperation({ summary: "Obtener pedidos de CAMABAR" })
  @ApiResponse({ status: 200, description: "Pedidos obtenidos exitosamente" })
  async getOrders() {
    // Por ahora usamos un ID fijo de CAMABAR, pero debería venir del context
    const camabarCompanyId = "clx1234567890";
    return this.camabarService.findAllOrders(camabarCompanyId);
  }
}
