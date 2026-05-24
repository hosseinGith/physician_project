import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 OneToOne,
 JoinColumn,
 OneToMany,
 ManyToOne,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Users } from './users.entity';
import { DoctorHours } from './doctorHours.entity';
import { Rates } from './rates.entity';
import { ChatRequests } from './chatRequests.entity';
import { Specialty } from './specialty.entity';

@Entity()
export class Doctors {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 // ارجاع به Users
 @OneToOne(() => Users, (user) => user.doctor)
 @JoinColumn()
 user: Users;
 @OneToMany(() => DoctorHours, (doctorHour) => doctorHour.doctor)
 doctorHours: DoctorHours[];
 @OneToMany(() => Rates, (rate) => rate.doctor)
 rates: Rates[];
 @OneToMany(() => ChatRequests, (chatRequest) => chatRequest.doctor)
 chatRequests: ChatRequests[];
 // تخصص (قلب، پوست، داخلی، ...)
 @ManyToOne(() => Specialty, (specialty) => specialty.doctors, {
  nullable: true, // اگه تخصص اجباری نباشه
  eager: false,
 })
 specialty: Specialty;
 // شماره نظام پزشکی
 @Column()
 medical_license_number: string;
 // هزینه ویزیت
 @Column()
 consultation_fee: string;
 // بیوگرافی
 @Column()
 bio: string;
}
