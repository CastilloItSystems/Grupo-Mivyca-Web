import { Module } from "@nestjs/common";
import { TransmivycaService } from "./transmivyca.service";
import { TransmivycaController } from "./transmivyca.controller";
import { PrismaModule } from "../../core/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [TransmivycaController],
  providers: [TransmivycaService],
  exports: [TransmivycaService],
})
export class TransmivycaModule {}
