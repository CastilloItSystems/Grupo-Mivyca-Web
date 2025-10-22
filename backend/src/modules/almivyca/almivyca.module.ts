import { Module } from "@nestjs/common";
import { AlmivycaService } from "./almivyca.service";
import { AlmivycaController } from "./almivyca.controller";
import { PrismaModule } from "../../core/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AlmivycaController],
  providers: [AlmivycaService],
  exports: [AlmivycaService],
})
export class AlmivycaModule {}
