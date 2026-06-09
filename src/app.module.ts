import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuditLogsMedicalModule } from './modules/auditLogsMedical/auditLogsMedical.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy';
import { PatientModule } from './modules/users/patient/patient.module';
import { DoctorModule } from './modules/users/doctor/doctor.module';
dotenv.config();

@Module({
 imports: [
  ThrottlerModule.forRoot([
   {
    ttl: 60 * 1000,
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
   entities: [__dirname + '/**/*.entity{.ts,.js}'],

   namingStrategy: new SnakeNamingStrategy(),
   synchronize: true,
  }),

  UsersModule,
  AuthModule,
  AppointmentsModule,
  AuditLogsMedicalModule,
  PrescriptionsModule,
  DoctorModule,
  PatientModule,
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
