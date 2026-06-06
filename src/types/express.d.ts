import { Users } from '../entities/users.entity';

declare global {
 namespace Express {
  interface Request {
   userAccess: string;
   user: Users;
  }
 }
}
