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

import { Users } from '../users.entity';
import { DoctorHours } from './hours/doctorHours.entity';
import { Rates } from './rates.entity';
import { ChatRequests } from '../../../entities/chatRequests.entity';
import { SpecialtyDoctors } from './specialtyDoctors.entity';
import { DoctorHourDays } from './days/doctorHourDays.entity';
import { DatesOfReservedDay } from './datesOfReservedDay/DatesOfReservedDay.entity';

@Entity()
export class Doctors {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 // ارجاع به Users
 @OneToOne(() => Users, (user) => user.doctor)
 @JoinColumn()
 user!: Users;

 @OneToMany(() => DoctorHours, (doctorHour) => doctorHour.doctor)
 doctorHours!: DoctorHours[];

 @OneToMany(() => DoctorHourDays, (day) => day.doctor)
 days!: DoctorHourDays[];
 @OneToMany(
  () => DatesOfReservedDay,
  (dateOfBlockedDay) => dateOfBlockedDay.doctor,
 )
 DatesOfReservedDay!: DatesOfReservedDay[];
 @OneToMany(() => Rates, (rate) => rate.doctor)
 rates!: Rates[];
 @OneToMany(() => ChatRequests, (chatRequest) => chatRequest.doctor)
 chatRequests!: ChatRequests[];
 // تخصص (قلب، پوست، داخلی، ...)
 @OneToMany(() => SpecialtyDoctors, (specialtyDoctor) => specialtyDoctor.doctor)
 specialties!: SpecialtyDoctors[];
 // شماره نظام پزشکی
 @Column()
 medical_license_number!: number;
 // هزینه ویزیت
 @Column()
 consultation_fee!: number;
 // بیوگرافی
 @Column()
 bio!: string;
}
