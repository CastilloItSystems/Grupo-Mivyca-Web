import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiResponse({
    status: 200,
    description: "Login exitoso",
    schema: {
      type: "object",
      properties: {
        access_token: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: { type: "string" },
            companyId: { type: "string" },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  @ApiOperation({ summary: "Registrar nuevo usuario" })
  @ApiResponse({
    status: 201,
    description: "Usuario creado exitosamente",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        role: { type: "string" },
        companyId: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({ status: 401, description: "Email ya registrado" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener perfil del usuario autenticado" })
  @ApiOkResponse({
    description: "Perfil del usuario",
    type: require("./dto/profile.dto").ProfileDto,
  })
  @ApiResponse({ status: 401, description: "Token inválido" })
  getProfile(@Request() req: any) {
    // Asegura que la respuesta tenga todas las propiedades del DTO
    const { userId, email, companyId, role } = req.user;
    return { userId, email, companyId, role };
  }
}
