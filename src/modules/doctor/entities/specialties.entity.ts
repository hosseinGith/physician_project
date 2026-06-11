
import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Specialties {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()

 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 @Column({ unique: true })
 name!: string;

 @Column({ unique: true })
 slug!: string;

 @Column({ nullable: true })
 icon?: string;
}
