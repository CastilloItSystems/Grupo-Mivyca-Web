import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum } from "class-validator";
import { UserRole } from "@prisma/client";

export class UpdateCompanyRoleDto {
  @ApiProperty({
    description: "Nuevo rol del usuario en la empresa",
    enum: UserRole,
    example: UserRole.MANAGER,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
