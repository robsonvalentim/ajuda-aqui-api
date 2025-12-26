import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete, // <--- Adicione Delete aqui
  ParseIntPipe,
  UseGuards,
  HttpCode, // <--- Adicione HttpCode aqui (boa prática para delete)
  HttpStatus, // <--- Adicione HttpStatus aqui
  Query,
  Patch,
} from '@nestjs/common';
import { HelpRequestsService } from './help-requests.service';
import { CreateHelpRequestDto } from './dto/create-help-request.dto';
// Importações de Segurança e Auth
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard'; // Ajuste o caminho se necessário
import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator'; // O decorator que criamos na Fase 3
import { User, UserRole } from '../../modules/users/entities/user.entity';

//para implementar a adoção de um pedido
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from '../../modules/auth/decorators/roles.decorator';

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
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() user: User,
    // 2. Capturamos os parâmetros opcionais da URL
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    // Passamos tudo para o service
    return this.helpRequestsService.findAll(user, category, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Blindar o detalhe
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User, // Passamos o usuário aqui também
  ) {
    return this.helpRequestsService.findOne(id, user);
  }

  // --- NOVA ROTA: ADOTAR PEDIDO ---
  @Patch(':id/adopt') // Rota: PATCH /help-requests/1/adopt
  @UseGuards(JwtAuthGuard, RolesGuard) // Proteção Dupla: Logado + Papel correto
  @Roles(UserRole.VOLUNTEER, UserRole.ADMIN) // Apenas Voluntários ou Admins
  adopt(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User, // Quem está adotando?
  ) {
    return this.helpRequestsService.adopt(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // 1. Só logado pode deletar
  @HttpCode(HttpStatus.NO_CONTENT) // 2. Retorna 204 (Sucesso sem conteúdo) por padrão
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User, // 3. Precisamos saber QUEM está tentando deletar
  ) {
    return this.helpRequestsService.remove(id, user);
  }
}
