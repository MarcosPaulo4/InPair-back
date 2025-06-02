import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP must be 8 digits' })
  cep: string;

  static toEntity(dto: CreateUserDto, hashedPassword: string) {
    return new User({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      cep: dto.cep,
    });
  }
}
