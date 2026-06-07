import {
 BeforeInsert,
 Column,
 Entity,
 ManyToOne,
 PrimaryColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Doctors } from './doctors.entity';

@Entity()
export class DoctorHours {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @ManyToOne(() => Doctors, (doctor) => doctor.doctorHours)
 doctor!: Doctors;
 @Column()
 hour!: string;
}
