export enum AccessType {
 Patient = 'patient',
 Doctor = 'doctor',
 Admin = 'admin',
}
export interface TokenType {
 username: string;
 id: number;
 iat: number;
}
