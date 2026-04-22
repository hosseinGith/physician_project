import {
 Entity,
 PrimaryGeneratedColumn,
 Column,
 CreateDateColumn,
 ManyToOne,
 OneToMany,
} from 'typeorm';
import { Patients } from './patients.entity';
import { Doctors } from './doctors.entity';
import { Prescriptions } from './prescriptions.entity';
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

 @ManyToOne(() => Patients)
 patient: Patients;
 // ارجاع به Doctors
 @ManyToOne(() => Doctors)
 doctor: Doctors;
 @OneToMany(() => Prescriptions, (prescription) => prescription.appointment)
 prescriptions: Prescriptions[];

 // تاریخ نوبت
 @Column({ type: 'date' })
 appointment_date: string;
 // ساعت نوبت
 @Column({ type: 'timestamp' })
 appointment_time: string;
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
 visit_type: string;
 // شرح علائم (قبل از ویزیت)
 @Column()
 symptoms: string;
 // زمان ثبت نوبت
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 created_at: Date;
 // یادآوری ارسال شده؟
 @Column({ type: 'bit' })
 reminder_sent: number;
}
