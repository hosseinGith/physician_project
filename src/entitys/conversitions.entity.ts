import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Conversitions {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 creator_id: number;
 @Column()
 doctor_id: number;
 @Column()
 patient_id: number;
}
