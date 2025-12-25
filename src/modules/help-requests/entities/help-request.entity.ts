import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Se der erro aqui, ignore por um instante

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

  @Column({ length: 20, default: 'ABERTO' })
  status: string; // Ex: ABERTO, EM_ANDAMENTO, CONCLUIDO

  // Futuramente faremos o relacionamento com o User aqui (ManyToOne)
  // @Column()
  // userId: number;
  // ESTA É A PARTE IMPORTANTE:
  // @ManyToOne(() => User, (user) => user.helpRequests, { onDelete: 'CASCADE' })
  // user: User;
  @ManyToOne(() => User, (user: User) => user.helpRequests, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  // Mantive este campo intencionalmente, veja a explicação abaixo
  @UpdateDateColumn()
  updatedAt: Date;
}
