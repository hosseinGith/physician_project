import {
 Entity,
 PrimaryGeneratedColumn,
 Column,
 OneToOne,
 JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Doctors {
 @PrimaryGeneratedColumn()
 id: number;

 // ارجاع به Users
 @OneToOne(() => Users)
 @JoinColumn()
 user: Users;

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
