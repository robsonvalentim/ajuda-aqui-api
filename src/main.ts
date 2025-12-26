import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 1. Importe o ValidationPipe
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Ative o Pipe Globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Segurança: Remove chaves que não estão no DTO (limpa o lixo)
      forbidNonWhitelisted: true, // Segurança: Dá erro se enviarem dados não permitidos
      transform: true, // Transforma os dados automaticamente (ex: string '1' vira number 1)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
