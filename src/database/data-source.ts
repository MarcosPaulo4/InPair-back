import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.resolve(__dirname, './migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
});
