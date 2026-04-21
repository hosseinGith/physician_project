import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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
 @Column()
 patien_i: number;
 // ارجاع به Doctors
 @Column()
 doctor_id: number;
 // ارجاع به Appointments (NULL اگر مشاوره آنلاین)
 @Column()
 appointment_id: number;
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
