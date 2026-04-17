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
 patientId: number;
 // ارجاع به Doctors
 @Column()
 doctorId: number;
 // ارجاع به Appointments (NULL اگر مشاوره آنلاین)
 @Column()
 appointmentId: number;
 // تاریخ تجویز
 @Column({ type: 'date' })
 issueDate: string;
 // تاریخ اعتبار
 @Column({ type: 'date' })
 validUntil: string;
 // تشخیص پزشک
 @Column()
 diagnosis: string;
 // لیست داروها (نام، دوز، مدت، توضیحات)
 @Column()
 medications: string;
 // امضای دیجیتال پزشک (برای اعتبار قانونی)
 @Column()
 doctorDigitalSignature: string;
 @Column({
  type: 'enum',
  enum: StatusPrescriptions,
 })
 status: string;
}
