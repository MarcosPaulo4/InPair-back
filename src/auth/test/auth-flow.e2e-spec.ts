import * as bcrypt from 'bcryptjs';
import { factory } from '../../../test/factories';
import { agent, api } from '../../../test/setup';
import { User } from '../../modules/users/entities/user.entity';

describe('Auth flow e2e', () => {
  it('should login, refresh token and logout', async () => {
    const plainPassword = 'Teste123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const [user] = await factory<User>(User, 1, { password: hashedPassword });
    const testAgent = agent();

    const loginResponse = await testAgent
      .post('/login')
      .send({ email: user.email, password: plainPassword })
      .expect(200);

    expect(loginResponse.body).toHaveProperty('message', 'Login successful');

    await testAgent.post('/refresh').expect(200);

    await testAgent.post('/logout').expect(200);
  });

  it('should return 400 for invalid credentials', async () => {
    const plainPassword = 'Teste123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const [user] = await factory<User>(User, 1, {
      password: hashedPassword,
    });

    const response = await api()
      .post('/login')
      .send({ email: user.email, password: 'Senha123' })
      .expect(401);

    expect(response.body).toHaveProperty(
      'message',
      'email or password provided not found',
    );
  });
});
