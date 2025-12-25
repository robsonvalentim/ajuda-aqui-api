import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 1. Criamos um "molde" para dizer o que tem dentro do Token
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 1. Onde buscar o token? No Header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Ignorar token vencido? Não. Se venceu, barra o acesso.
      ignoreExpiration: false,

      // 3. Qual a chave para descriptografar? A mesma do .env
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // 4. O que fazer se o token for válido?
  // O retorno deste método é injetado automaticamente em "request.user"
  // Erro que ficou dando nesse trecho Trocamos 'any' por 'JwtPayload'
  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
