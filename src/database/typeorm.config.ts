import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const isTest = process.env.NODE_ENV === 'test';

  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get<number>('DB_PORT', 5432),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
    synchronize: isTest,
    dropSchema: isTest,
    migrationsRun: !isTest,
  };
};
