import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole, User } from '../../users/entities/user.entity'; // <--- 1. Importe também o 'User'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // 2. O PULO DO GATO:
    // Dizemos: "O request retorna um objeto que obrigatoriamente tem um user do tipo User"
    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    // Verifica se o perfil do usuário está na lista permitida
    return requiredRoles.some((role) => user.role === role);
  }
}
