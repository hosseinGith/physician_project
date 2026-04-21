import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
export enum AccessTypeAuditLogs_MedicalEnum {
 VIEW = 'view',
 EDIT = 'edit',
 DOWNLOAD = 'download',
 PRINT = 'print',
}

@Entity()
export class AuditLogs_Medical {
 @PrimaryGeneratedColumn()
 id: number;
 // چه کسی دسترسی داشته
 @Column()
 accessed_by_user_id: number;
 // پرونده چه بیماری دیده شده
 @Column()
 patient_id: number;
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
