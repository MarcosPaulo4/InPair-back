import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../../auth/models/AuthRequest';
import { User } from '../../modules/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user as User;
  },
);
