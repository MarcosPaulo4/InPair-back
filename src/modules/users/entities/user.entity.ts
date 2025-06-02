import { IsUUID } from 'class-validator';
import { BaseModel } from 'src/common/enity/base.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseModel<User> {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  cep: string;

  @Column({})
  password: string;
}
