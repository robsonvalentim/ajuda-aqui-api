import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // 1. Configuração das Variáveis de Ambiente
    ConfigModule.forRoot({
      isGlobal: true, // Disponível em todo o projeto sem precisar importar de novo
    }),

    // 2. Configuração do Banco de Dados (Assíncrona)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Carrega as entidades automaticamente

        // ⚠️ ATENÇÃO DEVOPS:
        // synchronize: true -> Cria as tabelas automaticamente.
        // Ótimo para dev, PERIGOSO em produção (pode apagar dados).
        synchronize: true,
      }),
    }),

    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
