import BcryptEncrypt from ".";
import bcrypt from 'bcrypt';
describe('Encrypt tests', () => {
    it('should encrypt a string', () => {
        const sut = new BcryptEncrypt();
        const someString = 'any_string';
        const encryptedString = sut.encrypt(someString, 10);
        const result = bcrypt.compareSync(someString, encryptedString as string);
        expect(encryptedString).not.toBe(someString);
        expect(result).toBeTruthy();
    })

    it('should return null when data or salts are empty', () => {
        const sut = new BcryptEncrypt();
        const someString = 'any_string';
        const withoutSalt = sut.encrypt(someString, 0);
        const withoutData = sut.encrypt('', 10);
        expect(withoutSalt).toBeNull();
        expect(withoutData).toBeNull();
    })
})