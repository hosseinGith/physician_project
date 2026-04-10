export enum AccessType {
    User = "user"
    , Managment = 'managment'
    , Admin = "admin"
    , Public = "public"
}
export interface TokenType {
    username: string;
    id: number;
    iat: number;
}