import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { HelpRequest } from '../../help-requests/entities/help-request.entity';

// Enum para os perfis de acesso (Regra de Negócio)
export enum UserRole {
  RESIDENT = 'RESIDENT', // Morador
  VOLUNTEER = 'VOLUNTEER', // Voluntário
  MERCHANT = 'MERCHANT', // Comerciante
  ADMIN = 'ADMIN', // Administrador do Sistema
}

@Entity({ name: 'users' }) // Define o nome da tabela no MySQL
export class User {
  // ID UUID: Mais seguro que ID numérico (1, 2, 3...)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true }) // Email não pode repetir
  email: string;

  @Column({ select: false }) // Segurança: Nunca retorna a senha nas buscas (SELECT)
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.RESIDENT,
  })
  role: UserRole;

  // Impacto Social: Perfis verificados (ONGs, Líderes) geram confiança
  @Column({ default: false })
  isVerified: boolean;

  //lado do Usuário (OneToMany)
  @OneToMany(() => HelpRequest, (helpRequest: HelpRequest) => helpRequest.user)
  helpRequests: HelpRequest[];

  // Auditoria (DevOps): Saber quando foi criado/editado
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
