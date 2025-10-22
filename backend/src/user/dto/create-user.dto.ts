import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "manager@grupomivyca.com", // Ejemplo real del seed
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "admin123", // Ejemplo real del seed
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Nombre del usuario",
    example: "Roberto", // Ejemplo real del seed
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: "Apellido del usuario",
    example: "Manager", // Ejemplo real del seed
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: "ID de la empresa por defecto",
    example: "(ID real de empresa, ver respuesta de /companies)",
    required: false,
  })
  @IsString()
  @IsOptional()
  defaultCompanyId?: string;

  @ApiProperty({
    description: "Si el usuario está activo",
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "Si el email está verificado",
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;
}
