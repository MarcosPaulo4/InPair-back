import { TypeOrmBaseModel } from 'src/common/enity/type-orm-base.model';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends TypeOrmBaseModel<User> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  password: string;
}
