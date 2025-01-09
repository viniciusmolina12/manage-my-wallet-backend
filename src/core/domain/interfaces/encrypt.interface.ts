export default interface Encrypt {
    encrypt(value: string, salts: number): string;
}