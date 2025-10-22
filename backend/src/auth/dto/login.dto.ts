import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "superadmin@grupomivyca.com", // Ejemplo real del seed
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
}
