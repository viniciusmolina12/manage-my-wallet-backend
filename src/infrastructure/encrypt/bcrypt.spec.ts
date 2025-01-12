import BcryptEncrypt from ".";
import bcrypt from 'bcrypt';
describe('Encrypt tests', () => {
    it('should encrypt a string', () => {
        const sut = new BcryptEncrypt();
        const someString = 'any_string';
        const encryptedString = sut.encrypt(someString, 10);
        const result = bcrypt.compareSync(someString, encryptedString);
        expect(encryptedString).not.toBe(someString);
        expect(result).toBeTruthy();
    })
})