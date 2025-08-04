import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { DbTest } from '../database/createDb';
import { AppModule } from '../src/app.module';
config({ path: '.env.test' });

export const testRef = {} as {
  app: INestApplication;
};

const dbTest = new DbTest();

beforeAll(async () => {
  await dbTest.create();
  process.env['DB_NAME'] = dbTest.dbName;
  process.env['NODE_ENV'] = 'test';

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  testRef.app = moduleFixture.createNestApplication();

  testRef.app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await testRef.app.init();
});

beforeEach(async () => {
  await testRef.app.get(DataSource).dropDatabase();
  await testRef.app.get(DataSource).synchronize();
});

afterAll(async () => {
  if (testRef.app) {
    await testRef.app.close();
  }
  await dbTest.delete();
});
