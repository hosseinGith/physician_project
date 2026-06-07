import {
 Entity,
 PrimaryColumn,
 BeforeInsert,
 Column,
 ManyToOne,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { Doctors } from './doctors.entity';
import { Patients } from './patients.entity';
export enum RecordTypeMedicalRecordsEnum {
 LABRESULT = 'labResult',
 RADIOLOGY = 'radiology',
 PRESCRIPTION = 'prescription',
 CLINICALNOTE = 'clinicalNote',
}
@Entity()
export class MedicalRecords {
 @PrimaryColumn()
 id!: string;
 @BeforeInsert()
 private generateId() {
  this.id = nanoid();
 }
 // ارجاع به Patients
 @ManyToOne(() => Patients)
 patient!: Patients;
 // پزشک ثبت‌کننده (NULL اگر بیمار خودش آپلود کند)
 @ManyToOne(() => Doctors)
 doctor!: Doctors;
 @Column({
  type: 'enum',
  enum: RecordTypeMedicalRecordsEnum,
 })
 record_type!: string;
 // عنوان (مثلاً "آزمایش خون آبان ۱۴۰۴")
 @Column({ length: 200 })
 title!: string;
 // توضیحات
 @Column()
 description!: string;
 // مسیر فایل در S3/MinIO (PDF, JPG, DICOM)
 @Column({ length: 500 })
 file_path!: string;
 // هش فایل برای یکپارچگی
 @Column({ length: 100 })
 file_hash!: string;
 // زمان آپلود
 @Column({ type: 'date' })
 uploaded_at!: string;
 // تایید شده توسط پزشک؟
 @Column({ type: 'bit' })
 is_verified!: number;
}
