export enum AccessType {
 PATIENT = 'patient',
 DOCTOR = 'doctor',
 ACCEPTANCE = 'acceptance',
 ADMIN = 'admin',
 FINANCIAL_MANAGER="financialManager"
}
export interface TokenType {
 username: string;
 id: number;
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
