import {
 Entity,
 PrimaryColumn,
 Column,
 CreateDateColumn,
 ManyToOne,
 BeforeInsert,
} from 'typeorm';

import { Users } from '../../users/entities/users.entity';
export enum ActionEnum {
 CREATE = 'create',
 UPDATE = 'update',
 DELETE = 'delete',
 VIEW = 'view',
 ACCESS_DENIED = 'access_denied',
}
export enum TargetTypeEnum {
 PATIENT = 'patient',
 DOCTOR = 'doctor',
 APPOINTMENT = 'appointment',
 PRESCRIPTION = 'prescription',
}
@Entity('audit_logs')
export class AuditLogs {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 @ManyToOne(() => Users)
 userId!: Users;
 @Column({ nullable: true })
 targetId: number;

 @Column({ type: 'enum', enum: TargetTypeEnum })
 targetType: TargetTypeEnum;

 @Column({ type: 'enum', enum: ActionEnum })
 action: ActionEnum;

 @Column({ type: 'text', nullable: true })
 oldValue: string;
 @Column({ type: 'text', nullable: true })
 newValue: string;
 @Column({ nullable: true })
 ipAddress: string;
 @Column({ nullable: true })
 userAgent: string;
 @CreateDateColumn()
 createdAt: Date;
}
