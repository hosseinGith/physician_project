import {
 Entity,
 PrimaryColumn,
 Column,
 OneToOne,
 JoinColumn,
 BeforeInsert,
} from 'typeorm';

import { Doctors } from './doctors.entity';
export enum AppointmentAcceptType {
 AUTO = 'auto',
 MANUAL = 'manual',
}
@Entity()
export class DoctorsSettings {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }

 @OneToOne(() => Doctors, (doctor) => doctor.DoctorsSettings)
 @JoinColumn()
 doctor: Doctors;
 @Column({
  enum: AppointmentAcceptType,
  type: 'enum',
  default: AppointmentAcceptType.MANUAL,
 })
 appointmentAcceptType: AppointmentAcceptType;
}

