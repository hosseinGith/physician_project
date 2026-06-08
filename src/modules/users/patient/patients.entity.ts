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
import { randomInt } from 'node:crypto';
import { ChatRequests } from '../../../entities/chatRequests.entity';
import { Prescriptions } from '../../prescriptions/prescriptions.entity';
import { Appointments } from '../../appointments/appointments.entity';
@Entity()
export class Patients {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 // ارجاع به Users
 @OneToOne(() => Users, (user) => user.patient)
 @JoinColumn()
 user!: Users;
 @OneToMany(() => ChatRequests, (chatRequest) => chatRequest.patient)
 chatRequests!: ChatRequests[];
 @OneToMany(() => Prescriptions, (prescription) => prescription.patient)
 prescriptions!: Prescriptions[];
 @OneToMany(() => Appointments, (appointment) => appointment.patient)
 appointments!: Appointments[];
 // شماره پرونده پزشکی (منحصربه‌فرد)
 @Column({ unique: true })
 medical_record_number!: string;
 @BeforeInsert()
 generateShortUUID() {
  const min = Math.pow(10, 4 - 1);
  const max = Math.pow(10, 4) - 1;
  const code = randomInt(min, max + 1).toString();

  this.medical_record_number = `MR-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getSeconds()}-${code}`;
 }
 // گروه خونی
 @Column({ nullable: true })
 blood_type?: string;
 // حساسیت‌های دارویی/غذایی
 @Column({ nullable: true })
 allergies?: string;
 // بیماری‌های مزمن
 @Column({ nullable: true })
 chronic_diseases?: string;
 // نام شخص اضطراری
 @Column({ nullable: true })
 emergency_contact_name?: string;
 // تلفن شخص اضطراری (رمزگذاری شده)
 @Column({ nullable: true })
 emergency_contact_phone?: string;
 // شرکت بیمه
 @Column({ nullable: true })
 insurance_company?: string;
}
