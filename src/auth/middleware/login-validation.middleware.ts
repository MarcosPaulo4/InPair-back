import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { LoginRequestBody } from '../models/LoginRequestBody';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    const loginBody = new LoginRequestBody();
    loginBody.email = body.email;
    loginBody.password = body.password;

    const validations = await validate(loginBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.flatMap((validation) =>
          Object.values(validation.constraints),
        ),
      );
    }
    next();
  }
}
