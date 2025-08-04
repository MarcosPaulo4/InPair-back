import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testRef } from '../setup';

describe('User create (E2E)', () => {
  let app: INestApplication;

  beforeAll(() => {
    app = testRef.app;
  });

  it('should create a user', async () => {
    const user = {
      name: 'Marcos',
      email: 'email@teste.com',
      password: 'Teste123',
    };
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201);

    expect(createUserResponse.body).toHaveProperty('id');
    expect(createUserResponse.body.email).toBe(user.email);
  });
});
