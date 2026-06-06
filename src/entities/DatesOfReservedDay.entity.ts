import {
 BeforeInsert,
 Column,
 Entity,
 ManyToOne,
 PrimaryColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';
import { Doctors } from './doctors.entity';

enum TypeEnum {
 DAY = 'day',
 HOUR = 'hour',
}
enum ReserveTypeEnum {
 BLOCK = 'block',
 PATIENT = 'patient',
}
@Entity()
export class DatesOfReservedDay {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 @ManyToOne(() => Doctors, (doctor) => doctor.DatesOfReservedDay)
 doctor!: Doctors;
 @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 date!: Date;
 @Column({ enum: TypeEnum, type: 'enum', default: TypeEnum.DAY })
 type!: TypeEnum;
 @Column({
  enum: ReserveTypeEnum,
  type: 'enum',
  default: ReserveTypeEnum.PATIENT,
 })
 reserveType!: ReserveTypeEnum;
}

