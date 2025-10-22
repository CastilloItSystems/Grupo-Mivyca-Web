import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Prefijo global para las APIs
  app.setGlobalPrefix('api');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Grupo Mivyca API')
    .setDescription('API REST para la plataforma corporativa del Grupo Mivyca')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('companies', 'Gestión de empresas')
    .addTag('users', 'Gestión de usuarios')
    .addTag('almivyca', 'Módulos específicos de Almivyca')
    .addTag('transmivyca', 'Módulos específicos de Transmivyca')
    .addTag('camabar', 'Módulos específicos de CAMABAR')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación API: http://localhost:${port}/api/docs`);
}

bootstrap();
