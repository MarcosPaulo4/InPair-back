import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
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
      const access_token = await this.JwtService.signAsync(payloadData, {
        expiresIn: '30m',
      });
      const refresh_token = await this.JwtService.signAsync(payloadData, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
        expiresIn: '15d',
      });
      return {
        access_token,
        refresh_token,
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

  async refreshToken(user: UserPayload): Promise<UserToken> {
    try {
      const payload: UserPayload = {
        email: user.email,
        name: user.name,
        id: user.id,
      };

      const new_access_token = await this.JwtService.signAsync(payload, {
        expiresIn: '30m',
      });

      const new_refresh_token = await this.JwtService.signAsync(payload, {
        expiresIn: '15d',
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });

      return {
        access_token: new_access_token,
        refresh_token: new_refresh_token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          cep: user.cep,
        },
      };
    } catch (error) {
      handleError(error, 'Invalid refresh token', this.logger);
    }
  }
}
