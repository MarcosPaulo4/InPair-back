import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { handleError } from 'src/common/utils/error.utils';
import { User } from 'src/modules/users/entities/user.entity';
import { UserService } from 'src/modules/users/user.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly JwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordValid) {
      throw new BadRequestException('email or password provided not found');
    }

    const { password: hashedPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: User): Promise<UserToken> {
    try {
      const payloadData: UserPayload = {
        email: user.email,
        name: user.name,
        id: user.id,
      };
      const access_token = await this.JwtService.signAsync(payloadData);
      return {
        access_token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          cep: user.cep,
        },
      };
    } catch (error) {
      handleError(error, 'Invalid user', this.logger);
    }
  }
}
