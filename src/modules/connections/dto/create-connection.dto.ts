import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsNotEmpty()
  @IsString()
  receiverId: string;
}
