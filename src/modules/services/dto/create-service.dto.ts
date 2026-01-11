import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceCategory } from '../entities/service.entity';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  @Length(5, 100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  title: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString()
  @Length(10, 500)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description: string;

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsEnum(ServiceCategory, {
    message:
      'Categoria inválida. Opções: SAUDE, EDUCACAO, JURIDICO, ASSISTENCIA_SOCIAL, OUTROS',
  })
  category: ServiceCategory;

  // --- NOVOS CAMPOS DO MODELO ---

  @IsNotEmpty({ message: 'O endereço (ou ponto de referência) é obrigatório' })
  @IsString()
  @Length(5, 200)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  address: string;

  @IsNotEmpty({ message: 'A informação de contato é obrigatória' })
  @IsString()
  @Length(5, 100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  contactInfo: string;

  // Latitude e Longitude são Opcionais (o usuário pode não querer dar o pino exato)
  // Mas SE vierem, precisam ser números válidos de GPS.

  @IsOptional()
  @IsNumber({}, { message: 'A latitude deve ser um número' })
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'A longitude deve ser um número' })
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  isAddressHidden?: boolean;
}
