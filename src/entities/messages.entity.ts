import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 CreateDateColumn,
 ManyToOne,
 OneToOne,
 JoinColumn,
 UpdateDateColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Users } from '../modules/users/users.entity';
import { Conversitions } from './conversitions.entity';
import { Files } from './files.entity';
export enum FileTypeEnum {
 TEXT = 'text',
 IMAGE = 'image',
 FILE = 'file',
}
@Entity()
export class Messages {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @ManyToOne(() => Users)
 sender!: Users;
 @ManyToOne(() => Conversitions, (conversition) => conversition.messages)
 conversition!: Conversitions;
 @Column({ length: 2000 })
 content!: string;
 @Column({
  type: 'enum',
  enum: FileTypeEnum,
  enumName: 'FileType',
 })
 type!: string;
 @OneToOne(() => Messages, (message) => message)
 @JoinColumn()
 replyToMessage!: Messages;
 @ManyToOne(() => Files)
 file!: Files;
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 created_at!: Date;
 @UpdateDateColumn({ type: 'datetime', nullable: true })
 updated_at?: string;
}
