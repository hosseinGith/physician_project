import { IsEnum } from 'class-validator';
import { AccessType } from 'src/types';
import {
 Entity,
 PrimaryGeneratedColumn,
 Column,
 Unique,
 CreateDateColumn,
 OneToOne,
} from 'typeorm';
import { Doctors } from './doctors.entity';
import { Patients } from './patients.entity';

@Entity()
export class Users {
 @PrimaryGeneratedColumn()
 id: number;
 @OneToOne(() => Doctors, (doctor) => doctor.user)
 doctor: Doctors;
 @OneToOne(() => Patients, (patient) => patient.user)
 patient: Patients;
 @Column()
 first_name: string;
 @Column()
 last_name: string;
 @Column()
 @Unique('username', [])
 username: string;
 @Column()
 password: string;
 @Column({ length: 10, unique: true })
 national_id: string;
 @Column({ default: 'user' })
 @IsEnum(AccessType)
 access: AccessType;
 @Column({ default: true, type: 'boolean' })
 is_active: boolean;
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 created_at: Date;
}
