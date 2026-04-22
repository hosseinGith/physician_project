import {
 Entity,
 PrimaryGeneratedColumn,
 Column,
 CreateDateColumn,
 ManyToOne,
 OneToOne,
 JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Conversitions } from './conversitions.entity';
import { Files } from './files.entity';
export enum FileTypeEnum {
 TEXT = 'text',
 IMAGE = 'image',
 FILE = 'file',
}
@Entity()
export class Messages {
 @PrimaryGeneratedColumn()
 id: number;
 @ManyToOne(() => Users)
 sender: Users;
 @ManyToOne(() => Conversitions, (conversition) => conversition.messages)
 conversition: Conversitions;
 @Column({ length: 2000 })
 content: string;
 @Column({
  type: 'enum',
  enum: FileTypeEnum,
  enumName: 'FileType',
 })
 type: string;
 @OneToOne(() => Messages, (message) => message)
 @JoinColumn()
 replyToMessage: Messages;
 @ManyToOne(() => Files)
 file: Files;
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 created_at: Date;
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 updated_at: Date;
}
