import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 OneToOne,
 JoinColumn,
 OneToMany,
} from 'typeorm';


import { Users } from '../../users/entities/users.entity';

import { Rates } from './rates.entity';
import { ChatRequests } from '../../../entities/chatRequests.entity';
import { SpecialtyDoctors } from './specialtyDoctors.entity';

import { BlockedTimes } from '../blockedTimes/entities/blockedTimes.entity';

@Entity()
export class Doctors {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()

 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 // ارجاع به Users
 @OneToOne(() => Users, (user) => user.doctor)
 @JoinColumn()
 user!: Users;

 @OneToMany(() => BlockedTimes, (BlockedTime) => BlockedTime.doctor)
 BlockedTimes!: BlockedTimes[];

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
