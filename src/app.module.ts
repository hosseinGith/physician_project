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
import { Users } from './entitys/users.entity';
import dotenv from 'dotenv';
import { Appointments } from './entitys/appointments.entity';
import { AuditLogs_Medical } from './entitys/auditLogs_Medical.entity';
import { MedicalRecords } from './entitys/medicalRecords.entity';
import { Prescriptions } from './entitys/prescriptions.entity';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuditLogs_MedicalModule } from './modules/auditLogs_Medical/auditLogs_Medical.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { Patients } from './entitys/patients.entity';
import { Rates } from './entitys/rates.entity';
import { Doctors } from './entitys/doctors.entity';
import { Files } from './entitys/files.entity';
import { Messages } from './entitys/messages.entity';
import { Conversitions } from './entitys/conversitions.entity';
import { OtpCodes } from './entitys/otpCodes.entity';
import { DoctorHours } from './entitys/doctorHours.entity';
import { AuthGuard } from './shared/guards/auth.guard';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { WebsocketService } from './websocket/websocket.service';
import { ChatGateway } from './websocket/chat/chat.gateway';
import { ChatService } from './websocket/chat/chat.service';
import { ChatRequests } from './entitys/chatRequests.entity';
dotenv.config();

@Module({
 imports: [
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
    Patients,
    ChatRequests,
    Rates,
    Doctors,
    Files,
    Messages,
    Conversitions,
    Appointments,
    AuditLogs_Medical,
    MedicalRecords,
    Prescriptions,
    OtpCodes,
    DoctorHours,
   ],
   synchronize: true,
  }),
  TypeOrmModule.forFeature([
   Users,
   Patients,
   ChatRequests,
   Rates,
   Doctors,
   Files,
   Messages,
   Conversitions,
   Appointments,
   AuditLogs_Medical,
   Prescriptions,
   OtpCodes,
   DoctorHours,
   MedicalRecords,
  ]),
  UsersModule,
  AuthModule,
  AppointmentsModule,
  AuditLogs_MedicalModule,
  PrescriptionsModule,
 ],
 controllers: [AppController],
 providers: [
  AppService,
  {
   provide: APP_GUARD,
   useClass: ThrottlerGuard,
  },
  {
   provide: APP_GUARD,
   useClass: AuthGuard,
  },
  WebsocketGateway,
  WebsocketService,
  ChatGateway,
  ChatService,
 ],
})
export class AppModule {}
