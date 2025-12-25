import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    // AQUI ESTÁ A CORREÇÃO:
    // Dizemos explicitamente: "A requisição que vem aqui TEM um usuário dentro"
    const request = context.switchToHttp().getRequest<{ user: User }>();

    return request.user;
  },
);
