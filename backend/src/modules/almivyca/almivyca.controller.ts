import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AlmivycaService } from "./almivyca.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CompanyGuard } from "../../auth/guards/company.guard";

@ApiTags("almivyca")
@Controller("almivyca")
@UseGuards(JwtAuthGuard, CompanyGuard)
@ApiBearerAuth()
export class AlmivycaController {
  constructor(private readonly almivycaService: AlmivycaService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Obtener estadísticas del inventario de Almivyca" })
  @ApiResponse({
    status: 200,
    description: "Estadísticas del inventario obtenidas exitosamente",
  })
  async getDashboard() {
    // Por ahora usamos un ID fijo de Almivyca, pero debería venir del context
    const almivycaCompanyId = "clx1234567890";
    return this.almivycaService.getInventoryStats(almivycaCompanyId);
  }

  @Get("inventory")
  @ApiOperation({ summary: "Obtener productos de Almivyca" })
  @ApiResponse({ status: 200, description: "Productos obtenidos exitosamente" })
  async getInventory() {
    // Necesitamos obtener el companyId del contexto del guard
    // Por ahora usamos un ID fijo de Almivyca
    const almivycaCompanyId = "clx1234567890"; // Este ID debería venir del context
    return this.almivycaService.findAllProducts(almivycaCompanyId);
  }
}
