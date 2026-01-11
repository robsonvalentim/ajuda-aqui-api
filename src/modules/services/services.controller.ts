import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard'; // <--- Importe
import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator'; // <--- Importe
import { User } from '../../modules/users/entities/user.entity'; // <--- Importe

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Blindagem: Só entra quem tem Token
  create(
    @Body() createServiceDto: CreateServiceDto,
    @CurrentUser() user: User,
  ) {
    // Repassa os dados do corpo + o usuário extraído do token
    return this.servicesService.create(createServiceDto, user);
  }

  @Get()
  // Rota Pública? Geralmente sim, para as pessoas verem o que tem disponível.
  // Se quiser privada, adicione o @UseGuards
  findAll() {
    return this.servicesService.findAll();
  }

  // AQUI MUDOU: O Pipe converte string '1' para numero 1 automaticamente
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentUser() user: User, // <--- INJETAMOS O USUÁRIO AQUI
  ) {
    // Passamos o usuário para o serviço validar a permissão
    return this.servicesService.update(id, updateServiceDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User, // <--- INJETAMOS O USUÁRIO AQUI
  ) {
    return this.servicesService.remove(id, user);
  }
}
