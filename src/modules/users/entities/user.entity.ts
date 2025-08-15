import { Column, Entity } from 'typeorm';
import { TypeOrmBaseModel } from '../../../common/enity/type-orm-base.model';

@Entity('users')
export class User extends TypeOrmBaseModel<User> {
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column({ unique: true })
  email: string;
  @Column({})
  password: string;
}
