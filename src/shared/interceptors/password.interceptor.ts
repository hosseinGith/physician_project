import {
 CallHandler,
 ExecutionContext,
 Injectable,
 NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface ResponseWithPassword {
 password?: string;
 [key: string]: any;
}

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
 intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
  return next.handle().pipe(
   map((response: ResponseWithPassword) => {
    if (response && typeof response === 'object' && 'password' in response) {
     const { password, ...rest } = response;

     if (password !== undefined) {
      return rest;
     }
    }
    return response;
   }),
  );
 }
}
