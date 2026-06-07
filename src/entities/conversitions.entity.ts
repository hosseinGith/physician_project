import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 ManyToOne,
 OneToMany,
 Column,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Patients } from './patients.entity';
import { Doctors } from './doctors.entity';
import { Messages } from './messages.entity';
@Entity()
export class Conversitions {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @ManyToOne(() => Patients)
 patient!: Patients;
 @ManyToOne(() => Doctors)
 doctor!: Doctors;
 @OneToMany(() => Messages, (message) => message.conversition)
 messages!: Messages[];
 @Column()
 roomId!: string;
}
