import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 ManyToOne,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Users } from './users.entity';
enum UseTypeEnum {
 CONVERSITION = 'conversition',
 ADMINUPLOAD = 'adminUpload',
}

@Entity()
export class Files {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @Column()
 url: string;
 @Column({
  type: 'enum',
  enum: UseTypeEnum,
  enumName: 'UseType',
  default: UseTypeEnum.CONVERSITION,
 })
 @Column()
 use_type: string;
 @Column()
 type: string;
 @ManyToOne(() => Users, (user) => user)
 user: Users;
}
