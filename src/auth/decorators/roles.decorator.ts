import { SetMetadata } from '@nestjs/common';

// Decorator para restringir acceso por roles
// Uso: @Roles('ADMIN', 'MANAGER')
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
