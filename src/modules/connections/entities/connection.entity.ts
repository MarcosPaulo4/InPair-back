import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TypeOrmBaseModel } from '../../../common/enity/type-orm-base.model';
import { User } from '../../users/entities/user.entity';
import { ConnectionStatusEnum } from '../enum/connection-status.enum';

@Entity('connection')
export class Connection extends TypeOrmBaseModel<Connection> {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({ name: 'requester_id' })
  requesterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column({ name: 'receiver_id' })
  receiverId: string;
  @Column({
    type: 'enum',
    enum: ConnectionStatusEnum,
    default: ConnectionStatusEnum.PENDING,
  })
  status: ConnectionStatusEnum;
}
