import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Doctors {
 @PrimaryGeneratedColumn()
 id: number;
 // ارجاع به Users
 @Column()
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
