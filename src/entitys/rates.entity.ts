import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Rates {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 doctor_id: string;
 @Column()
 patient_id: number;
 @Column()
 rate: number;
 @Column()
 description: string;
}
