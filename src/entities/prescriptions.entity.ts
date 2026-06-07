import {
 Entity,
 PrimaryColumn,
 Column,
 ManyToOne,
 BeforeInsert,
 CreateDateColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Patients } from './patients.entity';
import { Doctors } from './doctors.entity';
import { Appointments } from '../modules/appointments/appointments.entity';
export enum StatusPrescriptions {
 ACTIVE = 'active',
 DISPENSED = 'dispensed',
 EXPIRED = 'expired',
}

@Entity()
export class Prescriptions {
 @PrimaryColumn()
 id: string;

 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 // ارجاع به Patients
 @ManyToOne(() => Patients, (patient) => patient.prescriptions)
 patient: Patients;

 // ارجاع به Appointments (NULL اگر مشاوره آنلاین)
 @ManyToOne(() => Appointments, (appointment) => appointment.prescriptions)
 appointment: Appointments;
 // تاریخ تجویز
 @Column({ type: 'date' })
 issue_date: string;
 // تاریخ اعتبار
 @Column({ type: 'date' })
 valid_until: string;
 // تشخیص پزشک
 @Column()
 diagnosis: string;
 // لیست داروها (نام، دوز، مدت، توضیحات)
 @Column()
 medications: string;
 // امضای دیجیتال پزشک (برای اعتبار قانونی)
 @Column()
 doctor_digital_signature: string;
 @Column({
  type: 'enum',
  enum: StatusPrescriptions,
 })
 status: StatusPrescriptions;
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 created_at: Date;
}
