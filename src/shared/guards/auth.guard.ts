import {
 CanActivate,
 ExecutionContext,
 ForbiddenException,
 Injectable,
 UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { TokenType } from 'src/types';

@Injectable()
export class AuthGuard implements CanActivate {
 constructor(
  private readonly jwtService: JwtService,
  private readonly users: UsersService,
 ) {}

 async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest<Request>();
  if (request.url.split('/')[1] === 'auth') return true;
  const token = String(request.headers?.authorization).split(' ')[1];
  if (!token) throw new UnauthorizedException();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const res = (await this.jwtService.verify(token)) as TokenType;

  if (res?.id) {
   const user = await this.users.findOne(res?.id, undefined, undefined, false);
   if (!user) throw new UnauthorizedException();

   if (!user?.is_active)
    throw new ForbiddenException(
     'اکانت شما فعال نشده است. تا فعال شدن آن منتظر بمونید.',
    );
   request['userAccess'] = user?.access || '';
   request.user = user;

   return true;
  } else throw new UnauthorizedException();
 }
}
