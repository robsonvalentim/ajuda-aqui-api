import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

// Mantemos o Enum para padronizar a entrada, mas salvamos como string simples se preferir
export enum ServiceCategory {
  HEALTH = 'SAUDE',
  EDUCATION = 'EDUCACAO',
  LEGAL = 'JURIDICO',
  ASSISTANCE = 'ASSISTENCIA_SOCIAL',
  OTHER = 'OUTROS',
}

@Entity('social_services')
export class Service {
  // 1. ID
  @PrimaryGeneratedColumn()
  id: number;

  // 2. Title
  @Column({ length: 100 })
  title: string;

  // 3. Description
  @Column('text')
  description: string;

  // 4. Category
  @Column({
    type: 'enum',
    enum: ServiceCategory,
    default: ServiceCategory.OTHER,
  })
  category: ServiceCategory;

  // 5. Address (Endereço legível)
  @Column()
  address: string;

  // 6. Latitude (Precisão para mapas)
  // decimal(10,8) é o padrão SQL para lat/long com precisão de GPS
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  // 7. Longitude
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  // 8. isAddressHidden (Regra de privacidade)
  @Column({ default: false })
  isAddressHidden: boolean;

  // 9. contactInfo
  @Column({ length: 100 })
  contactInfo: string;

  // --- ATRIBUTOS TÉCNICOS/RELACIONAIS (Para adicionar ao BrModelo) ---

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamento: Quem presta o serviço?
  @ManyToOne(() => User, (user) => user.services, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'providerId' })
  provider: User;
}
