import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Users } from 'src/entitys/users.entity';
import { TokenType } from 'src/types';
import { Repository } from 'typeorm';

@Injectable()
export class WsAuthGuard implements CanActivate {
 constructor(
  private readonly jwtService: JwtService,
  @InjectRepository(Users)
  private readonly usersRep: Repository<Users>,
 ) {}

 async canActivate(context: ExecutionContext): Promise<boolean> {
  const client: Socket = context.switchToWs().getClient();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const token = client.handshake.auth['token'];
  try {
   if (!token) throw new Error();

   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-argument
   const res = (await this.jwtService.verify(token)) as TokenType;
   if (res?.id) {
    const user = await this.usersRep.findOneBy({ id: res.id });
    if (!user) throw new Error();
    if (!user?.is_active) throw new Error();

    client['userAccess'] = user?.access || '';

    client['data'] = user;

    return true;
   } else throw new Error();
  } catch {
   client.emit('error', {
    status: 'auth',
   });
   return false;
  }
 }
}
