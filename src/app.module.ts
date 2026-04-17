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
import dotenv from 'dotenv';
import { Appointments } from './entitys/appointments.entity';
import { AuditLogs_Medical } from './entitys/auditLogs_Medical.entity';
import { MedicalRecords } from './entitys/medicalRecords.entity';
import { Prescriptions } from './entitys/prescriptions.entity';
import { AppointmentsModule } from './packages/appointments/appointments.module';
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
   entities: [
    Users,
    Appointments,
    AuditLogs_Medical,
    MedicalRecords,
    Prescriptions,
   ],
   synchronize: true,
  }),
  AppointmentsModule,
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
