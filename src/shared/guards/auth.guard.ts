import {
 CanActivate,
 ExecutionContext,
 ForbiddenException,
 Injectable,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Users } from 'src/entitys/users.entity';
import { TokenType } from 'src/types';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
 constructor(
  private readonly jwtService: JwtService,
  @InjectRepository(Users)
  private readonly usersRep: Repository<Users>,
 ) {}

 async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest<Request>();
  if (request.url.split('/')[1] === 'auth') return true;
  const token = String(request.headers?.authorization).split(' ')[1];
  if (!token) throw new UnauthorizedException();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const res = (await this.jwtService.verify(token)) as TokenType;

  if (res?.number) {
   const user = await this.usersRep.findOneBy({
    number: res?.number,
   });

   if (!user) throw new NotFoundException();
   if (!user?.is_active)
    throw new ForbiddenException(
     'اکانت شما فعال نشده است. تا فعال شدن آن منتظر بمونید.',
    );
   request['userAccess'] = user?.access || '';

   return true;
  } else throw new UnauthorizedException();
 }
}
