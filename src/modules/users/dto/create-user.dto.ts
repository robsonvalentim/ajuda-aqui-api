import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Por favor, forneça um email válido' })
  email: string;

  // Validação de Senha Forte (Nível de Segurança Bancária/Corporativa)
  @IsStrongPassword(
    {
      minLength: 8, // Mínimo de 8 caracteres
      minLowercase: 1, // Pelo menos 1 letra minúscula (a-z)
      minUppercase: 1, // Pelo menos 1 letra maiúscula (A-Z)
      minNumbers: 1, // Pelo menos 1 número (0-9)
      minSymbols: 1, // Pelo menos 1 caractere especial (!@#$%^&*)
    },
    {
      message:
        'A senha é muito fraca. Ela precisa ter: no mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número e 1 símbolo.',
    },
  )
  password: string;

  // Opcional: Se não enviar, o banco assume 'RESIDENT'
  @IsEnum(UserRole, { message: 'Tipo de usuário inválido' })
  role?: UserRole;
}
