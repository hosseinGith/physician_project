import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 CreateDateColumn,
 ManyToOne,
 OneToMany,
} from 'typeorm';

import { Patients } from '../../patient/entities/patients.entity';
import { Doctors } from '../../doctor/entities/doctors.entity';
import { Prescriptions } from '../../prescriptions/entities/prescriptions.entity';
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
 id!: string;
 @BeforeInsert()
 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 // ارجاع به Patients

 @ManyToOne(() => Patients, (patient) => patient.appointments)
 patient!: Patients;
 // ارجاع به Doctors
 @ManyToOne(() => Doctors)
 doctor!: Doctors;
 @OneToMany(() => Prescriptions, (prescription) => prescription.appointment)
 prescriptions!: Prescriptions[];

 // تاریخ نوبت
 @Column({ type: 'date' })
 appointment_date!: Date;
 // ساعت نوبت

 @Column({
  type: 'enum',
  enum: StatusAppointmentsEnum,
  default: StatusAppointmentsEnum.SCHEDULED,
 })
 status!: StatusAppointmentsEnum;

 @Column({
  type: 'enum',
  enum: VisitTypeAppointmentsEnum,
 })
 visit_type!: VisitTypeAppointmentsEnum;
 // شرح علائم (قبل از ویزیت)
 @Column()
 symptoms!: string;
 // زمان ثبت نوبت
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 created_at!: Date;
 // یادآوری ارسال شده؟
 @Column({ type: 'boolean', default: false })
 reminder_sent!: boolean;
}
