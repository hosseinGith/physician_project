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
 patientId: number;
 // پزشک ثبت‌کننده (NULL اگر بیمار خودش آپلود کند)
 @Column({ default: null })
 doctorId: number;
 @Column({
  length: 50,
  type: 'enum',
  enum: RecordTypeMedicalRecordsEnum,
 })
 recordType: string;
 // عنوان (مثلاً "آزمایش خون آبان ۱۴۰۴")
 @Column({ length: 200 })
 title: string;
 // توضیحات
 @Column()
 description: string;
 // مسیر فایل در S3/MinIO (PDF, JPG, DICOM)
 @Column({ length: 500 })
 filePath: string;
 // هش فایل برای یکپارچگی
 @Column({ length: 100 })
 fileHash: string;
 // زمان آپلود
 @Column({ type: 'date' })
 uploadedAt: string;
 // تایید شده توسط پزشک؟
 @Column({ type: 'bit' })
 isVerified: string;
}
