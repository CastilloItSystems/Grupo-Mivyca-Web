import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Prisma } from "@prisma/client";

@ApiTags("companies")
@Controller("companies")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: "Crear una nueva empresa" })
  @ApiResponse({ status: 201, description: "Empresa creada exitosamente" })
  async create(@Body() createCompanyDto: Prisma.CompanyCreateInput) {
    try {
      return await this.companyService.create(createCompanyDto);
    } catch (error) {
      throw new BadRequestException("Error al crear empresa: " + error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: "Obtener todas las empresas" })
  @ApiResponse({
    status: 200,
    description: "Lista de empresas obtenida exitosamente",
  })
  async findAll() {
    return this.companyService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una empresa por ID" })
  @ApiResponse({ status: 200, description: "Empresa encontrada exitosamente" })
  @ApiResponse({ status: 404, description: "Empresa no encontrada" })
  async findOne(@Param("id") id: string) {
    return this.companyService.findOne(id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Obtener una empresa por slug" })
  @ApiResponse({ status: 200, description: "Empresa encontrada exitosamente" })
  @ApiResponse({ status: 404, description: "Empresa no encontrada" })
  async findBySlug(@Param("slug") slug: string) {
    return this.companyService.findBySlug(slug);
  }

  @Get(":id/stats")
  @ApiOperation({ summary: "Obtener estadísticas de una empresa" })
  @ApiResponse({
    status: 200,
    description: "Estadísticas obtenidas exitosamente",
  })
  async getStats(@Param("id") companyId: string) {
    return this.companyService.getCompanyStats(companyId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar una empresa" })
  @ApiResponse({ status: 200, description: "Empresa actualizada exitosamente" })
  @ApiResponse({ status: 404, description: "Empresa no encontrada" })
  async update(
    @Param("id") id: string,
    @Body() updateCompanyDto: Prisma.CompanyUpdateInput
  ) {
    try {
      return await this.companyService.update(id, updateCompanyDto);
    } catch (error) {
      throw new BadRequestException(
        "Error al actualizar empresa: " + error.message
      );
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar una empresa" })
  @ApiResponse({ status: 200, description: "Empresa eliminada exitosamente" })
  @ApiResponse({ status: 404, description: "Empresa no encontrada" })
  async remove(@Param("id") id: string) {
    try {
      return await this.companyService.remove(id);
    } catch (error) {
      throw new BadRequestException(
        "Error al eliminar empresa: " + error.message
      );
    }
  }
}
