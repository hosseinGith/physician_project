import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
export enum FileTypeEnum {
 TEXT = 'text',
 IMAGE = 'image',
 FILE = 'file',
}
@Entity()
export class Messages {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 senderId: number;
 @Column()
 conversitionId: number;
 @Column({ length: 2000 })
 content: string;
 @Column({ length: 2000, enum: FileTypeEnum, enumName: 'FileType' })
 type: string;
 @Column({ default: null })
 fileURL: string;
 @Column({ default: null })
 fileSize: string;
 @Column({ default: null })
 replyToId: number;
 @Column({ type: 'datetime' })
 createdAt: string;
 @Column({ type: 'datetime', default: null })
 updatedAt: string;
}
