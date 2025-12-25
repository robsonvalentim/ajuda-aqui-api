import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHelpRequestDto } from './dto/create-help-request.dto';
import { HelpRequest } from './entities/help-request.entity';
import { User } from '../../modules/users/entities/user.entity'; // Importar User

@Injectable()
export class HelpRequestsService {
  constructor(
    @InjectRepository(HelpRequest)
    private helpRequestRepository: Repository<HelpRequest>,
  ) {}

  // Recebe o user como segundo argumento
  async create(createHelpRequestDto: CreateHelpRequestDto, user: User) {
    const newRequest = this.helpRequestRepository.create({
      ...createHelpRequestDto,
      user, // O TypeORM é esperto: ele pega o ID desse objeto user e salva na coluna userId
    });

    return await this.helpRequestRepository.save(newRequest);
  }

  findAll() {
    // Dica: Adicionei o 'relations' para trazer os dados do dono do pedido na lista
    return this.helpRequestRepository.find({
      relations: ['user'],
    });
  }

  // MUDANÇA AQUI NO FINDONE
  async findOne(id: number) {
    const request = await this.helpRequestRepository.findOne({
      where: { id },
      relations: ['user'], // Traz os dados do dono também no detalhe
    });

    if (!request) {
      throw new NotFoundException(
        `Pedido de ajuda com ID ${id} não encontrado`,
      );
    }

    return request;
  }
}
