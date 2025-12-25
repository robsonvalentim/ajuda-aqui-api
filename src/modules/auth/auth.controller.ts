import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Por padrão POST retorna 201, mas login não cria nada, então forçamos 200 (OK)
  async login(@Body() loginDto: LoginDto) {
    // 1. Verifica se email/senha batem
    const user = await this.authService.validateUser(loginDto);
    // 2. Se tudo ok, gera e retorna o token
    return this.authService.login(user);
  }
}
