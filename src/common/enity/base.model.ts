import * as R from 'ramda';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  constructor(data?: Partial<T>) {
    const isNotUndefined = (value: any) => !R.isNil(value);
    const parseData = R.pickBy(isNotUndefined, data);
    Object.assign(this, parseData);
  }
}
