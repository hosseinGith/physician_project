import { nanoid } from 'nanoid';
import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Specialties {
 @PrimaryColumn()
 id: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @Column({ unique: true })
 name: string;

 @Column({ unique: true })
 slug: string;

 @Column({ nullable: true })
 icon: string;
}
