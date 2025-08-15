import { faker } from '@faker-js/faker';
import { Type } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { User } from '../../src/modules/users/entities/user.entity';
import { dataSource } from '../setup';

export const factories = {
  User: (overrides: Partial<User> = {}): Partial<User> => ({
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'Teste123',
    ...overrides,
  }),
};

export async function factory<T>(
  entity: Type,
  amount = 1,
  overrides: Partial<T> = {},
): Promise<T[]> {
  const repository = dataSource.getRepository(entity);

  const items: DeepPartial<T>[] = Array.from({ length: amount }).map(() =>
    repository.create(
      factories[entity.name as keyof typeof factories](
        overrides,
      ) as DeepPartial<T>,
    ),
  );

  return await repository.save(items);
}
