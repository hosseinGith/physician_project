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
import { AuditLogsMedical } from './entitys/auditLogsMedical.entity';
import { MedicalRecords } from './entitys/medicalRecords.entity';
import { Prescriptions } from './entitys/prescriptions.entity';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuditLogsMedicalModule } from './modules/auditLogs_Medical/auditLogsMedical.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { Patients } from './entitys/patients.entity';
import { Rates } from './entitys/rates.entity';
import { Doctors } from './entitys/doctors.entity';
import { Files } from './entitys/files.entity';
import { Messages } from './entitys/messages.entity';
import { Conversitions } from './entitys/conversitions.entity';
import { OtpCodes } from './entitys/otpCodes.entity';
import { DoctorHours } from './entitys/doctorHours.entity';
import { ChatRequests } from './entitys/chatRequests.entity';
import { Specialties } from './entitys/specialties.entity';
import { SpecialtyDoctors } from './entitys/specialtyDoctors.entity';
import { DoctorHourDays } from './entitys/doctorHourDays.entity';
import { DatesOfReservedDay } from './entitys/DatesOfReservedDay.entity';
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
    AuditLogsMedical,
    MedicalRecords,
    Prescriptions,
    OtpCodes,
    DoctorHours,
    Specialties,
    SpecialtyDoctors,
    DoctorHourDays,
    DatesOfReservedDay,
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
   AuditLogsMedical,
   Prescriptions,
   OtpCodes,
   DoctorHours,
   Specialties,
   MedicalRecords,
   SpecialtyDoctors,
   DoctorHourDays,
   DatesOfReservedDay,
  ]),
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
