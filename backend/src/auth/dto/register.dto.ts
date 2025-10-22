import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
} from "class-validator";
import { UserRole } from "@prisma/client";

export class RegisterDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "admin@almivyca.com", // Ejemplo real del seed
  })
  @IsEmail({}, { message: "Debe ser un email válido" })
  @IsNotEmpty({ message: "El email es requerido" })
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "admin123", // Ejemplo real del seed
    minLength: 6,
  })
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La contraseña es requerida" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password: string;

  @ApiProperty({
    description: "Nombre del usuario",
    example: "Carlos", // Ejemplo real del seed
  })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre es requerido" })
  firstName: string;

  @ApiProperty({
    description: "Apellido del usuario",
    example: "Pérez",
  })
  @IsString({ message: "El apellido debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El apellido es requerido" })
  lastName: string;

  @ApiProperty({
    description: "ID de la empresa a la que pertenece",
    example: "almivyca",
  })
  @IsString({ message: "El ID de empresa debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El ID de empresa es requerido" })
  companyId: string;

  @ApiProperty({
    description: "Rol del usuario",
    example: "USER",
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole, { message: "Debe ser un rol válido" })
  role?: UserRole = UserRole.USER;
}
