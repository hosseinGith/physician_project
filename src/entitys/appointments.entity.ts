import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 CreateDateColumn,
 ManyToOne,
 OneToMany,
 OneToOne,
 JoinColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Patients } from './patients.entity';
import { Doctors } from './doctors.entity';
import { Prescriptions } from './prescriptions.entity';
import { DoctorHours } from './doctorHours.entity';
export enum StatusAppointmentsEnum {
 SCHEDULED = 'scheduled',
 COMPLETED = 'completed',
 CANCELLED = 'cancelled',
 NOSHOW = 'noShow',
 //  does not have time
 TIME = 'time',
}
export enum VisitTypeAppointmentsEnum {
 INPERSON = 'inPerson',
 ONLINE = 'online',
}

@Entity()
export class Appointments {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
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
 appointment_date: Date;
 // ساعت نوبت
 @OneToOne(() => DoctorHours)
 @JoinColumn()
 hour: DoctorHours;
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
 @Column({ type: 'boolean', default: false })
 reminder_sent: boolean;
}
