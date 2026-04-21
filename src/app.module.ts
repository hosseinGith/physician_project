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
import { \src\modules\prescriptions\prescriptionsService } from './src/modules/prescriptions/prescriptions.service';
import { Modules\prescriptions\prescriptionsService } from './modules/prescriptions/prescriptions.service';
import { Modules\prescriptions\prescriptionsController } from './modules/prescriptions/prescriptions.controller';
import { Modules\prescriptions\prescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
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
  AuditLogs_MedicalModule,
  Modules\prescriptions\prescriptionsModule, PrescriptionsModule,
 ],
 controllers: [AppController, Modules\prescriptions\prescriptionsController],
 providers: [
  AppService,
  {
   provide: APP_GUARD,
   useClass: ThrottlerGuard,
  },
  \src\modules\prescriptions\prescriptionsService, Modules\prescriptions\prescriptionsService,
 ],
})
export class AppModule {}
