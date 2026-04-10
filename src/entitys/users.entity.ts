import { IsEnum } from 'class-validator';
import { AccessType } from 'src/types';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    @Unique('username', [])
    username: string;
    @Column()
    password: string;
    @Column({ default: null })
    firstName?: string;
    @Column({ default: null })
    lastName?: string;
    @Column({ default: "user" })
    @IsEnum(AccessType)
    access: AccessType;

}
