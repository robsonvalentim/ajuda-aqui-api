import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateHelpRequestDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsString()
  @MaxLength(50)
  category: string;
}
