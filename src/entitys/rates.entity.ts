import {
 Entity,
 PrimaryGeneratedColumn,
 Column,
 OneToMany,
 JoinColumn,
} from 'typeorm';
import { Doctors } from './doctors.entity';
import { Users } from './users.entity';

@Entity()
export class Rates {
 @PrimaryGeneratedColumn()
 id: number;
 @OneToMany(() => Doctors, (doctor) => doctor.rates)
 @JoinColumn({ name: 'doctor_id' })
 @Column()
 doctors: Doctors;

 @Column({ default: null })
 doctor_id: string;
 @Column()
 @OneToMany(() => Users, (user) => user.rates)
 @JoinColumn({ name: 'doctor_id' })
 users: Users;
 @Column({ default: null })
 user_id: number;
 @Column()
 rate: number;
 @Column()
 description: string;
}
