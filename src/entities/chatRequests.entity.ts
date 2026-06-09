import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 ManyToOne,
 Column,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Patients } from '../modules/users/patient/patients.entity';
import { Doctors } from '../modules/users/doctor/entities/doctors.entity';
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
 private generateId() {
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
