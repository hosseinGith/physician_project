
import { Entity, PrimaryColumn, BeforeInsert, ManyToOne } from 'typeorm';
import { Doctors } from './doctors.entity';
import { Specialties } from './specialties.entity';

@Entity()
export class SpecialtyDoctors {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()

 private async generateId() {
  const { nanoid } = await import('nanoid');
  this.id = nanoid();
 }
 @ManyToOne(() => Doctors, (doctor) => doctor.specialties)
 doctor!: Doctors;
 @ManyToOne(() => Specialties)
 specialty!: Specialties;
}
