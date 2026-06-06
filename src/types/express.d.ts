import { Users } from '../entitys/users.entity';

declare global {
 namespace Express {
  interface Request {
   userAccess: string;
   user: Users;
  }
 }
}
