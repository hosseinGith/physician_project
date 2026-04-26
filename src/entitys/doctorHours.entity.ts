import {
 BeforeInsert,
 Column,
 Entity,
 ManyToOne,
 PrimaryColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Doctors } from './doctors.entity';
import { Matches } from 'class-validator';

@Entity()
export class DoctorHours {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @ManyToOne(() => Doctors, (doctor) => doctor.doctorHours)
 doctor: Doctors;
 @Column()
 @Matches(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, {
  message: 'ساعت باید در فرمت HH:MM باشد',
 })
 hour: string;
}
