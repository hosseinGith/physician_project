export enum AccessType {
 PATIENT = 'patient',
 DOCTOR = 'doctor',
 ACCEPTANCE = 'acceptance',
 ADMIN = 'admin',
 FINANCIAL_MANAGER = 'financialManager',
 SYSTEM_ADMIN = 'system_admin',
}
export interface TokenType {
 number: string;
 id: string;
 iat: number;
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
