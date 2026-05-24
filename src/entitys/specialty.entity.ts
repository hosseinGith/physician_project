import { nanoid } from 'nanoid';
import {
 Entity,
 Column,
 OneToMany,
 PrimaryColumn,
 BeforeInsert,
} from 'typeorm';
import { Doctors } from './doctors.entity';

@Entity()
export class Specialty {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @Column({ unique: true })
 name: string; // "قلب و عروق"

 @Column({ unique: true })
 slug: string; // "cardiology"

 @Column({ nullable: true })
 icon: string; // آیکون برای UI

 @OneToMany(() => Doctors, (doctor) => doctor.specialty)
 doctors: Doctors[];
}
