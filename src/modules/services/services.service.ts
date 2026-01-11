import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto'; // O CLI criou esse arquivo vazio
import { Service } from './entities/service.entity';
import { User, UserRole } from '../../modules/users/entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  // 1. CRIAR SERVIÇO
  async create(createServiceDto: CreateServiceDto, user: User) {
    // Cria a instância do serviço combinando os dados do DTO + o Usuário Logado
    const service = this.servicesRepository.create({
      ...createServiceDto,
      provider: user, // Vincula o "Dono" do serviço
    });

    return await this.servicesRepository.save(service);
  }

  // 2. LISTAR TODOS (Por enquanto, traz tudo)
  async findAll() {
    return await this.servicesRepository.find({
      relations: ['provider'], // Traz os dados de quem está oferecendo
    });
  }

  // 3. FIND ONE (Com verificação de erro)
  async findOne(id: number) {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['provider'],
    });

    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado`);
    }

    return service;
  }

  // 4. UPDATE (Corrigido)
  async update(id: number, updateServiceDto: UpdateServiceDto, user: User) {
    // 1. Buscamos para checar permissão
    const service = await this.findOne(id);

    // 2. Verificamos a permissão
    if (service.provider.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este serviço.',
      );
    }

    // 3. Preload mescla os dados
    const updatedService = await this.servicesRepository.preload({
      id: id,
      ...updateServiceDto,
    });

    // CORREÇÃO: Verificamos se o preload falhou (TypeScript exige isso)
    if (!updatedService) {
      throw new NotFoundException(
        `Serviço com ID ${id} não encontrado para atualização`,
      );
    }

    // Agora o TS sabe que 'updatedService' é um objeto válido
    return await this.servicesRepository.save(updatedService);
  }

  // 5. REMOVE (Real e Seguro)
  async remove(id: number, user: User) {
    const service = await this.findOne(id);

    // Verificamos a permissão
    if (service.provider.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este serviço.',
      );
    }

    return await this.servicesRepository.remove(service);
  }
}
