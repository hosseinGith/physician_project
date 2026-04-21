import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Conversitions {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 creatorId: number;
 @Column()
 doctorId: number;
 @Column()
 patientId: number;
}
