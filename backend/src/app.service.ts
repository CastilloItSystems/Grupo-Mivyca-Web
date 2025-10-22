import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: '🚀 API de Grupo Mivyca funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      companies: ['Almivyca', 'Transmivyca', 'CAMABAR']
    };
  }

  getHealth(): object {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
