import {
 BeforeInsert,
 Column,
 Entity,
 ManyToOne,
 PrimaryColumn,
} from 'typeorm';


import { Doctors } from '../../entities/doctors.entity';
@Entity('doctorBlockedTimes')
export class BlockedTimes {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()

 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 @ManyToOne(() => Doctors, (doctor) => doctor.BlockedTimes)
 doctor!: Doctors;
 @Column()
 date!: Date;
 @Column()
 start_time!: Date;
 @Column()
 end_time!: Date;
 @Column({ nullable: true })
 reason?: string;
}
