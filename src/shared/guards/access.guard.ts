import {
 CanActivate,
 ExecutionContext,
 ForbiddenException,
 Injectable,
} from '@nestjs/common';
import { AccessType } from 'src/types';

@Injectable()
export class AccessGuard implements CanActivate {
 constructor(private readonly access: AccessType[]) {}
 canActivate(context: ExecutionContext): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = context.switchToHttp().getRequest();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const userAccess = request['userAccess'];

  if (
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
   this.access.includes(userAccess) ||
   userAccess === AccessType.SYSTEM_ADMIN
  )
   return true;
  throw new ForbiddenException();
 }
}
