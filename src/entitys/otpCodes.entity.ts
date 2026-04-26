import {
 BeforeInsert,
 Column,
 Entity,
 PrimaryColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

@Entity()
export class OtpCodes {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @Column({ length: process.env.OTP_code_length })
 code: string;
 @Column()
 number: string;
 @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'datetime' })
 created_at: Date;
}
