import { IsNotEmpty, IsString } from 'class-validator';
import { CreateConnectionDto } from './create-connection.dto';

export class UpdateConnectionDto extends CreateConnectionDto {
  @IsNotEmpty()
  @IsString()
  requesterId: string;
}
