import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateHelpRequestDto } from './dto/create-help-request.dto';
import { HelpRequest, HelpRequestStatus } from './entities/help-request.entity';
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
      // Dizemos ao TS: "Trate essa string como um HelpRequestStatus"
      whereOptions.status = status as HelpRequestStatus;
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

  // --- NOVO MÉTODO: ADOTAR PEDIDO ---
  async adopt(id: number, volunteer: User) {
    // 1. Buscamos o pedido (sem restrição de dono, pois o voluntário precisa achar o pedido de outro)
    const request = await this.helpRequestRepository.findOne({
      where: { id },
      relations: ['user', 'volunteer'], // Trazemos para garantir que não dê erro de leitura
    });

    if (!request) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    // 2. REGRA DE NEGÓCIO: Só pode adotar se estiver ABERTO
    if (request.status !== HelpRequestStatus.OPEN) {
      throw new ForbiddenException(
        'Este pedido não está mais disponível para adoção (já foi adotado ou concluído).',
      );
    }

    // 3. REGRA OPCIONAL: Não pode adotar o próprio pedido (se quiser implementar)
    if (request.user.id === volunteer.id) {
      throw new ForbiddenException('Você não pode adotar seu próprio pedido.');
    }

    // 4. Executa a Adoção
    request.volunteer = volunteer; // Vincula o voluntário
    request.status = HelpRequestStatus.IN_PROGRESS; // Muda o status

    // Salva no banco
    return await this.helpRequestRepository.save(request);
  }

  // --- NOVO MÉTODO: CONCLUIR PEDIDO ---
  async close(id: number, user: User) {
    // 1. Busca o pedido com os relacionamentos (Dono e Voluntário)
    const request = await this.helpRequestRepository.findOne({
      where: { id },
      relations: ['user', 'volunteer'],
    });

    if (!request) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    // 2. Verifica se já está fechado
    if (request.status === HelpRequestStatus.CLOSED) {
      throw new ForbiddenException('Este pedido já está concluído.');
    }

    // 3. REGRA DE SEGURANÇA: Quem pode fechar?
    // - O Dono do pedido (request.user.id === user.id)
    // - O Voluntário responsável (request.volunteer?.id === user.id)
    // - Um Admin (user.role === ADMIN) -> Opcional, mas útil para moderação
    const isOwner = request.user.id === user.id;
    const isTheVolunteer = request.volunteer?.id === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isTheVolunteer && !isAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para concluir este pedido.',
      );
    }

    // 4. Efetiva o fechamento
    request.status = HelpRequestStatus.CLOSED;

    return await this.helpRequestRepository.save(request);
  }
}
