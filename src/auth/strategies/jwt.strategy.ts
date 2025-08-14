import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserFromJwt } from '../models/UserFromJwt';
import { UserPayload } from '../models/UserPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_TOKEN'),
    });
  }

  async validate(payload: UserPayload): Promise<UserFromJwt> {
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
  }
}
