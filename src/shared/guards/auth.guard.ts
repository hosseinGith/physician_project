import {
 CanActivate,
 ExecutionContext,
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
  const token = String(request.headers?.authorization).split(' ')[1];
  try {
   if (!token) throw new Error();
   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
   const res = (await this.jwtService.verify(token)) as TokenType;
   if (res?.username) {
    const user = await this.usersRep.findOneBy({ username: res.username });
    if (!user) throw new NotFoundException();

    request['userAccess'] = user?.access || '';
    return true;
   } else return Boolean(res);
  } catch {
   throw new UnauthorizedException();
  }
 }
}
