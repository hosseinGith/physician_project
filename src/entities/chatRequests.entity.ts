import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 ManyToOne,
 Column,
} from 'typeorm';

import { Patients } from '../modules/patient/entities/patients.entity';
import { Doctors } from '../modules/doctor/entities/doctors.entity';
enum ChatRequestStatusEnum {
 REJECTED = 'rejected',
 ACCEPTED = 'accepted',
 WAITING = 'waiting',
}
@Entity()
export class ChatRequests {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 @ManyToOne(() => Patients, (patients) => patients.chatRequests)
 patient!: Patients;
 @ManyToOne(() => Doctors, (doctor) => doctor.chatRequests)
 doctor!: Doctors;
 @Column({ default: ChatRequestStatusEnum.WAITING })
 status!: ChatRequestStatusEnum;
 @Column()
 roomId!: string;
}
