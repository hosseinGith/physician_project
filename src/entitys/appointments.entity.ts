import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
export enum StatusAppointmentsEnum {
 SCHEDULED = 'scheduled',
 COMPLETED = 'completed',
 CANCELLED = 'cancelled',
 NOSHOW = 'noShow',
}
export enum VisitTypeAppointmentsEnum {
 INPERSON = 'inPerson',
 ONLINE = 'online',
}

@Entity()
export class Appointments {
 @PrimaryGeneratedColumn()
 id: number;
 // ارجاع به Patients
 @Column()
 patientId: number;
 // ارجاع به Doctors
 @Column()
 doctorId: number;
 // تاریخ نوبت
 @Column({ type: 'date' })
 appointmentDate: string;
 // ساعت نوبت
 @Column({ type: 'timestamp' })
 appointmentTime: string;
 @Column({
  type: 'enum',
  enum: StatusAppointmentsEnum,
  default: StatusAppointmentsEnum.SCHEDULED,
 })
 status: string;

 @Column({
  type: 'enum',
  enum: VisitTypeAppointmentsEnum,
 })
 visitType: string;
 // شرح علائم (قبل از ویزیت)
 @Column()
 symptoms: string;
 // زمان ثبت نوبت
 @Column({ type: 'datetime' })
 createdAt: string;
 // یادآوری ارسال شده؟
 @Column({ type: 'datetime' })
 reminderSent: string;
}
