import { UserPayload } from './UserPayload';

export interface UserToken {
  access_token: string;
  user: UserPayload;
}
