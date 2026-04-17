import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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
 accessedByUserId: number;
 // پرونده چه بیماری دیده شده
 @Column()
 patientId: number;
 @Column({
  length: 20,
  type: 'enum',
  enum: AccessTypeAuditLogs_MedicalEnum,
 })
 accessType: string;
 // دلیل دسترسی (مثلاً "ویزیت پزشک")
 @Column({ length: 200 })
 accessReason: string;
 // IP کاربر
 @Column({ length: 45 })
 ipAddress: string;
 // زمان دسترسی
 @Column({ type: 'datetime' })
 accessedAt: string;
}
