import { IsEnum } from 'class-validator';
import { AccessType } from 'src/types';
import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 CreateDateColumn,
 OneToOne,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Doctors } from './doctor/entities/doctors.entity';
import { Patients } from './patient/patients.entity';

@Entity()
export class Users {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @Column({ unique: true })
 number!: string;
 @OneToOne(() => Doctors, (doctor) => doctor.user)
 doctor!: Doctors;
 @OneToOne(() => Patients, (patient) => patient.user)
 patient!: Patients;
 @Column({ nullable: true })
 first_name?: string;
 @Column({ nullable: true })
 last_name?: string;
 @Column({ length: 10, nullable: true, unique: true })
 national_id?: string;
 @Column({ default: AccessType.PATIENT })
 @IsEnum(AccessType)
 access!: AccessType;
 @Column({ default: true, type: 'boolean' })
 is_active!: boolean;
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 created_at!: Date;
}
