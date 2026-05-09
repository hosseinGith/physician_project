import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 OneToOne,
 JoinColumn,
 OneToMany,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Users } from './users.entity';
import { DoctorHours } from './doctorHours.entity';
import { Rates } from './rates.entity';
import { ChatRequests } from './chatRequests.entity';

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
 @Column()
 specialty: string;
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
