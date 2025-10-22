import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Obtener company ID de los parámetros de la URL o del cuerpo de la petición
    const companyId = request.params?.companyId || request.body?.companyId;

    // Si no hay companyId en la request, permitir acceso
    if (!companyId) {
      return true;
    }

    // Verificar que el usuario pertenezca a la empresa solicitada
    if (user.companyId !== companyId) {
      throw new ForbiddenException(
        `No tienes permisos para acceder a los recursos de esta empresa`
      );
    }

    return true;
  }
}
