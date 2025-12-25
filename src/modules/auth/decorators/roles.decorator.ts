import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

// Essa é a chave que usaremos para ler os dados depois
export const ROLES_KEY = 'roles';

// Aqui criamos o decorator @Roles(Role.ADMIN, Role.VOLUNTEER)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
