export default interface Encrypt {
   encrypt(value: string, salts: number): string | null;
   compare(value: string, hash: string): boolean;
}
