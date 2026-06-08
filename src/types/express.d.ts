import { Users } from '../modules/users/users.entity';

declare global {
 namespace Express {
  interface Request {
   userAccess: string;
   user: Users;
  }
 }
}
