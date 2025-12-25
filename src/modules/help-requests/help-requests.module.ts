import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar isso
import { HelpRequestsService } from './help-requests.service';
import { HelpRequestsController } from './help-requests.controller';
import { HelpRequest } from './entities/help-request.entity'; // Importar a entidade

@Module({
  imports: [
    TypeOrmModule.forFeature([HelpRequest]), // Registra o repositório dessa entidade
  ],
  controllers: [HelpRequestsController],
  providers: [HelpRequestsService],
})
export class HelpRequestsModule {}
