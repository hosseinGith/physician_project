import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Patients } from './patients.entity';
import { Doctors } from './doctors.entity';
import { Appointments } from './appointments.entity';
export enum StatusPrescriptions {
 ACTIVE = 'active',
 DISPENSED = 'dispensed',
 EXPIRED = 'expired',
}

@Entity()
export class Prescriptions {
 @PrimaryGeneratedColumn()
 id: number;
 // ارجاع به Patients
 @ManyToOne(() => Patients)
 patient: Patients;
 // ارجاع به Doctors
 @ManyToOne(() => Doctors)
 doctor: Doctors;

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
 status: string;
}
