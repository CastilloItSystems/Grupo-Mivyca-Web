import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { UserRole } from "@prisma/client";

export class AddCompanyAccessDto {
  @ApiProperty({
    description: "ID de la empresa",
    example: "clx1234567890",
  })
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({
    description: "Rol del usuario en la empresa",
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
