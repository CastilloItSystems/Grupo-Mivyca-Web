import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CompanyGuard } from "../auth/guards/company.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AddCompanyAccessDto } from "./dto/add-company-access.dto";
import { UpdateCompanyRoleDto } from "./dto/update-company-role.dto";
import { UserRole } from "@prisma/client";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado exitosamente" })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException("Error al crear usuario: " + error.message);
    }
  }

  @Post("with-company-access")
  @ApiOperation({ summary: "Crear usuario con acceso a empresas específicas" })
  @ApiResponse({
    status: 201,
    description: "Usuario con acceso multi-empresa creado exitosamente",
  })
  async createWithCompanyAccess(
    @Body()
    data: {
      user: CreateUserDto;
      companyAccess: { companyId: string; role: UserRole }[];
    }
  ) {
    try {
      return await this.userService.createWithCompanyAccess(
        data.user,
        data.companyAccess
      );
    } catch (error) {
      throw new BadRequestException(
        "Error al crear usuario con acceso multi-empresa: " + error.message
      );
    }
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los usuarios" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuarios obtenida exitosamente",
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get("by-company/:companyId")
  @ApiOperation({
    summary: "Obtener usuarios que tienen acceso a una empresa específica",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de usuarios por empresa obtenida exitosamente",
  })
  @UseGuards(CompanyGuard)
  async findByCompany(@Param("companyId") companyId: string) {
    return this.userService.findByCompany(companyId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un usuario por ID" })
  @ApiResponse({ status: 200, description: "Usuario encontrado exitosamente" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Get("email/:email")
  @ApiOperation({ summary: "Obtener un usuario por email" })
  @ApiResponse({ status: 200, description: "Usuario encontrado exitosamente" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async findByEmail(@Param("email") email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException("Usuario no encontrado");
    }
    return user;
  }

  @Get(":id/companies")
  @ApiOperation({
    summary: "Obtener todas las empresas a las que un usuario tiene acceso",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de empresas del usuario obtenida exitosamente",
  })
  async getUserCompanies(@Param("id") userId: string) {
    return this.userService.getUserCompanies(userId);
  }

  @Get(":id/company/:companyId/access")
  @ApiOperation({
    summary: "Verificar si un usuario tiene acceso a una empresa específica",
  })
  @ApiResponse({
    status: 200,
    description: "Estado de acceso verificado exitosamente",
  })
  async hasCompanyAccess(
    @Param("id") userId: string,
    @Param("companyId") companyId: string
  ) {
    const hasAccess = await this.userService.hasCompanyAccess(
      userId,
      companyId
    );
    return { hasAccess };
  }

  @Get(":id/company/:companyId/role")
  @ApiOperation({
    summary: "Obtener el rol de un usuario en una empresa específica",
  })
  @ApiResponse({
    status: 200,
    description: "Rol del usuario obtenido exitosamente",
  })
  async getUserRoleInCompany(
    @Param("id") userId: string,
    @Param("companyId") companyId: string
  ) {
    const role = await this.userService.getUserRoleInCompany(userId, companyId);
    return { role };
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar un usuario" })
  @ApiResponse({ status: 200, description: "Usuario actualizado exitosamente" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new BadRequestException(
        "Error al actualizar usuario: " + error.message
      );
    }
  }

  @Post(":id/company-access")
  @ApiOperation({ summary: "Agregar acceso de usuario a una empresa" })
  @ApiResponse({ status: 201, description: "Acceso agregado exitosamente" })
  async addCompanyAccess(
    @Param("id") userId: string,
    @Body() addCompanyAccessDto: AddCompanyAccessDto
  ) {
    try {
      return await this.userService.addCompanyAccess(
        userId,
        addCompanyAccessDto.companyId,
        addCompanyAccessDto.role
      );
    } catch (error) {
      throw new BadRequestException(
        "Error al agregar acceso a empresa: " + error.message
      );
    }
  }

  @Patch(":id/company/:companyId/role")
  @ApiOperation({ summary: "Actualizar rol de usuario en una empresa" })
  @ApiResponse({ status: 200, description: "Rol actualizado exitosamente" })
  async updateCompanyRole(
    @Param("id") userId: string,
    @Param("companyId") companyId: string,
    @Body() updateRoleDto: UpdateCompanyRoleDto
  ) {
    try {
      return await this.userService.updateCompanyRole(
        userId,
        companyId,
        updateRoleDto.role
      );
    } catch (error) {
      throw new BadRequestException(
        "Error al actualizar rol: " + error.message
      );
    }
  }

  @Delete(":id/company/:companyId/access")
  @ApiOperation({ summary: "Remover acceso de usuario a una empresa" })
  @ApiResponse({ status: 200, description: "Acceso removido exitosamente" })
  async removeCompanyAccess(
    @Param("id") userId: string,
    @Param("companyId") companyId: string
  ) {
    try {
      await this.userService.removeCompanyAccess(userId, companyId);
      return { message: "Acceso removido exitosamente" };
    } catch (error) {
      throw new BadRequestException(
        "Error al remover acceso: " + error.message
      );
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un usuario" })
  @ApiResponse({ status: 200, description: "Usuario eliminado exitosamente" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async remove(@Param("id") id: string) {
    try {
      return await this.userService.remove(id);
    } catch (error) {
      throw new BadRequestException(
        "Error al eliminar usuario: " + error.message
      );
    }
  }
}
