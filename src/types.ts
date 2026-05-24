export enum AccessType {
 PATIENT = 'patient',
 DOCTOR = 'doctor',
 ACCEPTANCE = 'acceptance',
 ADMIN = 'admin',
 FINANCIAL_MANAGER = 'financialManager',
 SYSTEM_ADMIN = 'system_admin',
}
export interface TokenType {
 id: string;
}
export const FilesTypePublicAccess = [
 'pdf',
 'jpg',
 'jpeg',
 'png',
 'dicom',
 'heic',
 'csv',
 'xlsx',
 'xml',
];
export const FilesTypeDoctorsAccess = ['csv', 'xlsx', 'xml'];
