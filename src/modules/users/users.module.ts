import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importante
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // <--- Importante

@Module({
  // Aqui dizemos: "Neste módulo, disponibilize o Repositório da tabela User"
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // Dica: Exportar o serviço permite que o AuthModule o use no futuro
  exports: [UsersService],
})
export class UsersModule {}
