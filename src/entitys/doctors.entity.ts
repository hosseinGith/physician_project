import {
 Entity,
 PrimaryGeneratedColumn,
 Column,
 OneToMany,
 JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Rates } from './rates.entity';

@Entity()
export class Doctors {
 @PrimaryGeneratedColumn()
 id: number;

 @OneToMany(() => Users, (user) => user.doctors)
 @JoinColumn({ name: 'user_id' })
 users: Users;
 @OneToMany(() => Rates, (rate) => rate.doctors)
 rates: Rates;
 // ارجاع به Users
 @Column({ unique: true })
 user_id: number;
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
 // امتیاز از بیماران (۱ تا ۵)
 @Column()
 rating: string;
 // ساعات کاری هفتگی
 @Column()
 work_hours: string;
}
