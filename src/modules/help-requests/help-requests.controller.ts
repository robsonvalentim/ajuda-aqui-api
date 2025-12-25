import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { HelpRequestsService } from './help-requests.service';
import { CreateHelpRequestDto } from './dto/create-help-request.dto';
// Importações de Segurança e Auth
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard'; // Ajuste o caminho se necessário
import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator'; // O decorator que criamos na Fase 3
import { User } from '../../modules/users/entities/user.entity';

@Controller('help-requests')
export class HelpRequestsController {
  constructor(private readonly helpRequestsService: HelpRequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // 1. Bloqueia acesso se não tiver token válido
  create(
    @Body() createHelpRequestDto: CreateHelpRequestDto,
    @CurrentUser() user: User, // <--- A MÁGICA É AQUI: O Decorator pega o usuário do request
  ) {
    // Agora passamos o DTO (dados do pedido) + o User (dono) para o service
    return this.helpRequestsService.create(createHelpRequestDto, user);
  }

  @Get()
  findAll() {
    return this.helpRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Note que agora o 'id' já chega aqui tipado como 'number'.
    // O ParseIntPipe garantiu a conversão e validação.
    return this.helpRequestsService.findOne(+id);
  }
}
