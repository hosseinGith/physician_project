import {
 CanActivate,
 ExecutionContext,
 ForbiddenException,
 Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AccessType } from 'src/types';

@Injectable()
export class AccessGuard implements CanActivate {
 constructor(private readonly reflector: Reflector) {}

 canActivate(context: ExecutionContext): boolean {
  const requiredAccess = this.reflector.getAllAndOverride<AccessType[]>(
   'accessTypes',
   [context.getHandler(), context.getClass()],
  );

  if (!requiredAccess) return true;

  const request = context.switchToHttp().getRequest<Request>();
  const userAccess = request.userAccess as AccessType;

  if (
   userAccess === AccessType.SYSTEM_ADMIN ||
   userAccess === AccessType.PUBLIC ||
   requiredAccess.includes(userAccess as AccessType)
  )
   return true;

  throw new ForbiddenException();
 }
}
