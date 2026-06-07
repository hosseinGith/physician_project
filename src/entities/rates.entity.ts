import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 ManyToOne,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Doctors } from './doctors.entity';
import { Patients } from './patients.entity';

@Entity()
export class Rates {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @ManyToOne(() => Doctors, (doctor) => doctor.rates)
 doctor!: Doctors;
 @ManyToOne(() => Patients)
 patient!: Patients;
 @Column()
 score!: number;
 @Column()
 description!: string;
}
