import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 CreateDateColumn,
 ManyToOne,
} from 'typeorm';


import { Patients } from '../../patient/entities/patients.entity';
import { Users } from '../../users/entities/users.entity';
export enum AccessTypeAuditLogsMedicalEnum {
 VIEW = 'view',
 EDIT = 'edit',
 DOWNLOAD = 'download',
 PRINT = 'print',
}

@Entity()
export class AuditLogsMedical {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()

 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 // چه کسی دسترسی داشته
 @ManyToOne(() => Users)
 accessed_by!: Users;

 // پرونده چه بیماری دیده شده
 @ManyToOne(() => Patients)
 patient!: Patients;
 // ارجاع به Doctors

 @Column({
  type: 'enum',
  enum: AccessTypeAuditLogsMedicalEnum,
 })
 access_type!: string;
 // دلیل دسترسی (مثلاً "ویزیت پزشک")
 @Column({ length: 200 })
 access_reason!: string;
 // IP کاربر
 @Column({ length: 45 })
 ip_address!: string;
 // زمان دسترسی
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 accessed_at!: Date;
}
