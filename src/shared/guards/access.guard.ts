import {
 CanActivate,
 ExecutionContext,
 ForbiddenException,
 Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessType } from 'src/types';

@Injectable()
export class AccessGuard implements CanActivate {
 constructor(private readonly reflector: Reflector) {}
 canActivate(context: ExecutionContext): boolean {
  const requiredAccess = this.reflector.get<AccessType[]>(
   'accessTypes',
   context.getHandler(),
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = context.switchToHttp().getRequest();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const userAccess = request['userAccess'];
  console.log(requiredAccess, userAccess);

  if (
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
   requiredAccess?.includes(userAccess) ||
   userAccess === AccessType.SYSTEM_ADMIN
  )
   return true;
  throw new ForbiddenException();
 }
}
