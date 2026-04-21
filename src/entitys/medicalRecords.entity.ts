import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
export enum RecordTypeMedicalRecordsEnum {
 LABRESULT = 'labResult',
 RADIOLOGY = 'radiology',
 PRESCRIPTION = 'prescription',
 CLINICALNOTE = 'clinicalNote',
}
@Entity()
export class MedicalRecords {
 @PrimaryGeneratedColumn()
 id: number;
 // ارجاع به Patients
 @Column()
 patient_id: number;
 // پزشک ثبت‌کننده (NULL اگر بیمار خودش آپلود کند)
 @Column({ default: null })
 doctor_id: number;
 @Column({
  type: 'enum',
  enum: RecordTypeMedicalRecordsEnum,
 })
 record_type: string;
 // عنوان (مثلاً "آزمایش خون آبان ۱۴۰۴")
 @Column({ length: 200 })
 title: string;
 // توضیحات
 @Column()
 description: string;
 // مسیر فایل در S3/MinIO (PDF, JPG, DICOM)
 @Column({ length: 500 })
 file_path: string;
 // هش فایل برای یکپارچگی
 @Column({ length: 100 })
 file_hash: string;
 // زمان آپلود
 @Column({ type: 'date' })
 uploaded_at: string;
 // تایید شده توسط پزشک؟
 @Column({ type: 'bit' })
 is_verified: number;
}
