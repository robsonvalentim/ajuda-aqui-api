import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHelpRequestDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  // BLINDAGEM: Mínimo 5 (qualidade), Máximo 100 (banco)
  @Length(5, 100, { message: 'O título deve ter entre 5 e 100 caracteres' })
  // 2. Aplique o Transform: Pega o valor e executa o .trim()
  // SOLUÇÃO: Tipamos a entrada como { value: unknown } para evitar o 'any'
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  title: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString()
  // BLINDAGEM: Obriga o usuário a detalhar o problema (Mín 10)
  @Length(10, 500, {
    message: 'A descrição deve ter entre 10 e 500 caracteres',
  })
  // 3. Aplique também na descrição
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description: string;

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsString()
  // BLINDAGEM: Mantém o limite do banco (50) mas evita siglas estranhas (<3)
  @Length(3, 50, { message: 'A categoria deve ter entre 3 e 50 caracteres' })
  // 4. E na categoria
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  category: string;
}
