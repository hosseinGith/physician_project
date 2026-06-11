import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 ManyToOne,
} from 'typeorm';


import { Doctors } from './doctors.entity';
import { Patients } from '../../patient/entities/patients.entity';

@Entity()
export class Rates {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()

 private async generateId() {
  const { nanoid } = await import('nanoid');
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
