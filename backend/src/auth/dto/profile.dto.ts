import { ApiProperty } from "@nestjs/swagger";

export class ProfileDto {
  @ApiProperty({
    example: "cmh1cyni200047q0iiq5joqo4",
    description: "ID del usuario",
  })
  userId: string;

  @ApiProperty({
    example: "superadmin@grupomivyca.com",
    description: "Email del usuario",
  })
  email: string;

  @ApiProperty({
    example: "(ID real de empresa, ver JWT)",
    description: "ID de la empresa activa",
  })
  companyId?: string;

  @ApiProperty({
    example: "SUPER_ADMIN",
    description: "Rol del usuario en la empresa",
  })
  role?: string;
}
