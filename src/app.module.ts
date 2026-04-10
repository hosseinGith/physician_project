import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './packages/users/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './packages/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entitys/users.entity';
import { ProductsModule } from './packages/products/products.module';
import dotenv from 'dotenv';
import { Products } from './entitys/products.entity';
dotenv.config();

@Module({
 imports: [
  UsersModule,
  AuthModule,

  ThrottlerModule.forRoot([
   {
    // min
    ttl: 60 * 1000,
    // count
    limit: 20,
   },
  ]),
  JwtModule.register({ secret: process.env?.JWT_secret, global: true }),
  TypeOrmModule.forRoot({
   type: 'mysql',
   host: process.env?.db_host,
   port: 3306,
   username: process.env?.db_user,
   password: process.env?.db_password,
   database: process.env?.db_database,
   entities: [Users, Products],
   synchronize: true,
  }),
  ProductsModule,
 ],
 controllers: [AppController],
 providers: [
  AppService,
  {
   provide: APP_GUARD,
   useClass: ThrottlerGuard,
  },
 ],
})
export class AppModule {}
