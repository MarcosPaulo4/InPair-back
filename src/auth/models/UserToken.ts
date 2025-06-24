import { UserPayload } from './UserPayload';

export interface UserToken {
  access_token: string;
  refresh_token: string;
  user: UserPayload;
}
