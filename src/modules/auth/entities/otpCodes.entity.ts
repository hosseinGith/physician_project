import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';


@Entity()
export class OtpCodes {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()

 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 @Column({ length: process.env.OTP_CODE_LENGTH || 5 })
 code!: string;
 @Column()
 number!: string;
 @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'datetime' })
 created_at!: Date;
}
