import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 CreateDateColumn,
 ManyToOne,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Patients } from './patients.entity';
import { Users } from './users.entity';
export enum AccessTypeAuditLogs_MedicalEnum {
 VIEW = 'view',
 EDIT = 'edit',
 DOWNLOAD = 'download',
 PRINT = 'print',
}

@Entity()
export class AuditLogs_Medical {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 // چه کسی دسترسی داشته
 @ManyToOne(() => Users)
 accessed_by: Users;

 // پرونده چه بیماری دیده شده
 @ManyToOne(() => Patients)
 patient: Patients;
 // ارجاع به Doctors

 @Column({
  type: 'enum',
  enum: AccessTypeAuditLogs_MedicalEnum,
 })
 access_type: string;
 // دلیل دسترسی (مثلاً "ویزیت پزشک")
 @Column({ length: 200 })
 access_reason: string;
 // IP کاربر
 @Column({ length: 45 })
 ip_address: string;
 // زمان دسترسی
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 accessed_at: Date;
}
