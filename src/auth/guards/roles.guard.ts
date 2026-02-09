import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Verificar si el usuario tiene el rol requerido
    if (!user.role) {
      return false;
    }

    const userRoleName = typeof user.role === 'string' ? user.role : user.role.name;
    return requiredRoles.some((role) => userRoleName === role);
  }
}
