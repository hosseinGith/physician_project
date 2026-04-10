import { CanActivate, ExecutionContext, ForbiddenException, Injectable, } from '@nestjs/common';
import { AccessType } from 'src/types';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly access: AccessType[]
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean {

    if (this.access[0] === AccessType.Public)
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userAccess = request['userAccess']

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (this.access.includes(userAccess)) return true
    throw new ForbiddenException()
  }
}
