import { api } from '../../../../test/setup';

describe('User create e2e', () => {
  it('should create a user', async () => {
    const response = await api()
      .post('/users')
      .send({
        name: 'Marcos',
        email: 'marcos@teste.com',
        surname: 'Paulo',
        password: 'Teste123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Marcos');
  });

  it('should return 409 for user already exists', async () => {
    await api().post('/users').send({
      name: 'Marcos',
      surname: 'Paulo',
      email: 'marcos@teste.com',
      password: 'Teste123',
    });

    await api()
      .post('/users')
      .send({
        name: 'Marcos',
        surname: 'Paulo',
        email: 'marcos@teste.com',
        password: 'Teste123',
      })
      .expect(409);
  });

  it('should return 400 for missing credentials', async () => {
    const response = await api()
      .post('/users')
      .send({
        name: 'Marcos',
        email: 'marcos@teste.com',
      })
      .expect(400);
    expect(response.body).toHaveProperty('error', 'Bad Request');
  });
});
