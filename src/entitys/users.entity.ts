import { IsEnum } from 'class-validator';
import { AccessType } from 'src/types';
import {
 Entity,
 PrimaryGeneratedColumn,
 Column,
 Unique,
 CreateDateColumn,
 OneToMany,
} from 'typeorm';
import { Doctors } from './doctors.entity';
import { Patients } from './patients.entity';
import { Rates } from './rates.entity';

@Entity()
export class Users {
 @PrimaryGeneratedColumn()
 id: number;
 @OneToMany(() => Doctors, (doctor) => doctor.users)
 doctors: Doctors;
 @OneToMany(() => Patients, (patient) => patient.users)
 patients: Patients;
 @Column()
 @OneToMany(() => Rates, (rate) => rate.users)
 rates: Rates;
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
