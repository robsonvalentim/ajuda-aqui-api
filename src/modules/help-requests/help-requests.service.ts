import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateHelpRequestDto } from './dto/create-help-request.dto';
import { HelpRequest } from './entities/help-request.entity';
import { User, UserRole } from '../../modules/users/entities/user.entity'; // Importar User

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

  // --- 1. FIND ALL (Listagem Inteligente) ---
  findAll(user: User, category?: string, status?: string) {
    const isStaff =
      user.role === UserRole.ADMIN || user.role === UserRole.VOLUNTEER;

    // 👇 2. A MUDANÇA ESTÁ AQUI:
    // Em vez de 'any', dizemos que é um objeto de busca para a entidade HelpRequest
    const whereOptions: FindOptionsWhere<HelpRequest> = {};

    // REGRA 1: Filtro de Dono (Se não for staff)
    if (!isStaff) {
      whereOptions.user = { id: user.id };
    }

    // REGRA 2: Filtro de Categoria
    if (category) {
      whereOptions.category = category; // Agora o TS sabe que 'category' existe!
    }

    // REGRA 3: Filtro de Status
    if (status) {
      whereOptions.status = status; // Agora o TS sabe que 'status' existe!
    }

    return this.helpRequestRepository.find({
      where: whereOptions,
      relations: ['user'],
    });
  }

  // --- 2. FIND ONE (Detalhe Blindado) ---
  // Note que adicionamos o argumento user aqui também
  async findOne(id: number, user: User) {
    const request = await this.helpRequestRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!request) {
      throw new NotFoundException(
        `Pedido de ajuda com ID ${id} não encontrado`,
      );
    }

    // Lógica de Segurança de Leitura:
    const isStaff =
      user.role === UserRole.ADMIN || user.role === UserRole.VOLUNTEER;
    const isOwner = request.user.id === user.id;

    // Se NÃO for Staff E TAMBÉM NÃO for o dono... bloqueia!
    if (!isStaff && !isOwner) {
      throw new ForbiddenException(
        'Você não tem permissão para visualizar este pedido.',
      );
    }

    return request;
  }

  async remove(id: number, user: User) {
    // AVISO: Como mudamos a assinatura do findOne acima para exigir (id, user),
    // precisamos passar o user aqui também!
    const request = await this.findOne(id, user);

    // A validação de segurança já acontece dentro do findOne agora!
    // Se o findOne não lançar erro, significa que o usuário PODE VER.
    // Mas... poder VER não significa poder DELETAR.
    // Admin pode ver, mas talvez só o dono possa deletar?
    // (Por enquanto, vamos manter que só o dono deleta, reforçando a regra antiga)
    if (request.user.id !== user.id) {
      // ... lançamos erro 403 (Proibido)
      throw new ForbiddenException('Apenas o dono pode excluir o pedido.');
    }

    // 3. Se passou, pode deletar
    return await this.helpRequestRepository.remove(request);
  }
}
