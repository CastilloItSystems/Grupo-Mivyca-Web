import { Module } from "@nestjs/common";
import { CamabarService } from "./camabar.service";
import { CamabarController } from "./camabar.controller";
import { PrismaModule } from "../../core/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CamabarController],
  providers: [CamabarService],
  exports: [CamabarService],
})
export class CamabarModule {}
