import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Se der erro aqui, ignore por um instante

// 1. Criamos o Enum para garantir que o status seja sempre válido
export enum HelpRequestStatus {
  OPEN = 'ABERTO',
  IN_PROGRESS = 'EM_ANDAMENTO',
  CLOSED = 'CONCLUIDO',
}

@Entity('help_requests') // Nome da tabela no banco (snake_case é padrão para tabelas SQL)
export class HelpRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 50 })
  category: string; // Adicionado conforme sua modelagem

  // 2. Usamos o Enum na coluna status
  @Column({
    type: 'enum',
    enum: HelpRequestStatus,
    default: HelpRequestStatus.OPEN, // Todo pedido nasce ABERTO
  })
  status: HelpRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamento com o Dono (Quem pediu)
  @ManyToOne(() => User, (user) => user.helpRequests, { nullable: false })
  user: User;

  // 3. NOVO: Relacionamento com o Voluntário (Quem adotou)
  // Pode ser nulo (nullable: true) porque no começo ninguém adotou ainda
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'volunteerId' }) // Nomeamos a coluna no banco para ficar claro
  volunteer: User;
}
