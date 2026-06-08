import {
 BeforeInsert,
 Column,
 Entity,
 ManyToOne,
 PrimaryColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Doctors } from '../doctors.entity';
import { DoctorHours } from '../hours/doctorHours.entity';
enum DaysNameTypeEnum {
 SUNDAY = 'sunday',
 MONDAY = 'monday',
 TUESDAY = 'tuesday',
 WEDNESDAY = 'wednesday',
 THURSDAY = 'thursday',
 FRIDAY = 'friday',
 SATURDAY = 'saturday',
}
@Entity()
export class DoctorHourDays {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @ManyToOne(() => Doctors, (doctor) => doctor.days)
 doctor!: Doctors;
 @ManyToOne(() => DoctorHours)
 hour!: DoctorHours;
 @Column({ enum: DaysNameTypeEnum, type: 'enum' })
 dayName!: DaysNameTypeEnum;
}
