import { IsEnum } from 'class-validator';
import { AccessType } from 'src/types';
import {
 Entity,
 PrimaryGeneratedColumn,
 Column,
 Unique,
 CreateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 @Unique('username', [])
 username: string;
 @Column()
 password: string;
 @Column({ length: 10 })
 nationalId: string;
 @Column({ default: 'user' })
 @IsEnum(AccessType)
 access: AccessType;
 @Column({ default: true, type: 'boolean' })
 isActive: boolean;
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;
}
