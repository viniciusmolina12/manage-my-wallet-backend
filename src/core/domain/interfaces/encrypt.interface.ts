export default interface Encrypt {
    encrypt(value: string, salts: number): string;
    generateJwt(data: any, secret: string, expiresIn?: Date): string;
}