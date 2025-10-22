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
    example: "usuario@grupomivyca.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Nombre del usuario",
    example: "Juan",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: "Apellido del usuario",
    example: "Pérez",
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: "ID de la empresa por defecto",
    example: "clx1234567890",
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
