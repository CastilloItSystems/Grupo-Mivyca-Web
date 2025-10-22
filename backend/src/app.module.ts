import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { AlmivycaModule } from './modules/almivyca/almivyca.module';
import { TransmivycaModule } from './modules/transmivyca/transmivyca.module';
import { CamabarModule } from './modules/camabar/camabar.module';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Módulos core
    PrismaModule,
    
    // Módulos de autenticación y usuarios
    AuthModule,
    UserModule,
    CompanyModule,
    
    // Módulos específicos por empresa
    AlmivycaModule,
    TransmivycaModule,
    CamabarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
