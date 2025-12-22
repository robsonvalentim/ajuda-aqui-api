import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Verificar se o email já existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Este email já está cadastrado.');
    }

    // 2. Criptografar a senha (Hash)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3. Criar o objeto do usuário
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // Substitui a senha original pelo hash
    });

    // 4. Salvar no Banco
    return await this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // 1. O método 'preload' cria uma entidade misturando os dados antigos com os novos
    // Ele não salva no banco ainda, apenas prepara o objeto.
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });

    // 2. Se o usuário não existir, preload retorna undefined
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // 3. Salva as alterações
    return this.usersRepository.save(user);
  }

  // (Manteremos os outros métodos vazios ou padrão por enquanto)
  findAll() {
    return `This action returns all users`;
  }
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  /*update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }*/
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
