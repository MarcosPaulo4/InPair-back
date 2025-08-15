import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

export let app: INestApplication;
export let dataSource: DataSource;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.use(cookieParser());
  await app.init();

  dataSource = app.get(DataSource);
});

beforeEach(async () => {
  await dataSource.dropDatabase();
  await dataSource.synchronize();
});

afterAll(async () => {
  if (dataSource) {
    await dataSource.destroy();
  }
  await app.close();
});

export const api = () => request(app.getHttpServer());
export const agent = () => request.agent(app.getHttpServer());
