import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // <--- 1. Importe isso
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator'; // <--- Importe aqui
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe) // Ativa a validação do DTO
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 2. ADICIONE O CADEADO AQUI
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <--- Adicione o RolesGuard aqui
  @Roles(UserRole.ADMIN) // <--- Apenas ADMIN entra aqui!
  @Get()
  // MUDANÇA AQUI: Injetamos o user com o decorator
  findAll(@CurrentUser() user: User) {
    console.log('Quem está chamando a rota?', user.email); // <--- Teste visual no terminal
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Removemos o '+' antes do id, pois UUID é string!
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
