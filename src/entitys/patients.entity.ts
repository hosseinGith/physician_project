import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Patients {
 @PrimaryGeneratedColumn()
 id: number;
 // ارجاع به Users
 @Column()
 user_id: number;
 @OneToMany(() => Users, (user) => user.patients)
 @Column()
 users: Users;
 // شماره پرونده (یکتا، مثل MR-۱۴۰۴-۱۲۳۴)
 @Column({ unique: true, default: () => 'gen_random_uuid()' })
 medical_record_number: string;
 // گروه خونی
 @Column()
 blood_type: string;
 // حساسیت‌های دارویی/غذایی (JSON)
 @Column()
 allergies: string;
 // بیماری‌های مزمن
 @Column()
 chronic_diseases: string;
 // نام شخص اضطراری
 @Column()
 emergency_contact_name: string;
 // تلفن شخص اضطراری (رمزگذاری شده)
 @Column()
 emergency_contact_phone: string;
 // شرکت بیمه
 @Column()
 insurance_company: string;
}
