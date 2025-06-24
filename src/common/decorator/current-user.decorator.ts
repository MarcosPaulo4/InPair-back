import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { User } from 'src/modules/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user as User;
  },
);
