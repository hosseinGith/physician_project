import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctors } from './doctors.entity';
import { Patients } from './patients.entity';

@Entity()
export class Rates {
 @PrimaryGeneratedColumn()
 id: number;
 @ManyToOne(() => Doctors)
 doctor: Doctors;
 @ManyToOne(() => Patients)
 patient: Patients;
 @Column()
 rate: number;
 @Column()
 description: string;
}
