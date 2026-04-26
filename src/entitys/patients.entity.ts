import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 OneToOne,
 JoinColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Users } from './users.entity';
import { randomInt } from 'node:crypto';
@Entity()
export class Patients {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 // ارجاع به Users

 @OneToOne(() => Users, (user) => user.patient)
 @JoinColumn()
 user: Users;
 // شماره پرونده (یکتا، مثل MR-۱۴۰۴-۱۲۳۴)
 @Column({ unique: true })
 medical_record_number: string;
 @BeforeInsert()
 generateShortUUID() {
  const min = Math.pow(10, 4 - 1);
  const max = Math.pow(10, 4) - 1;
  const code = randomInt(min, max + 1).toString();

  this.medical_record_number = `MR-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getSeconds()}-${code}`;
 }
 // گروه خونی
 @Column()
 blood_type: string;
 // حساسیت‌های دارویی/غذایی
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
