import { JsonWebTokenJwtGenerator } from "."

describe('Jsonwebtoken generator', () => {
    it('should generate a jwt', () => {
        const sut = new JsonWebTokenJwtGenerator();
        const secret = 'ANY_SECRET';
        const jwt = sut.generateJwt({ field: 'any_value' }, secret, '1h');
        const decoded = sut.verify(jwt, secret);
        expect(jwt).toBeTruthy();
        expect(decoded.field).toBe('any_value');
    })

    it('should return false when token is invalid', () => {
        const sut = new JsonWebTokenJwtGenerator();
        const secret = 'ANY_SECRET';
        const jwt = sut.generateJwt({ field: 'any_value' }, secret, '1h');
        const decoded = sut.verify(jwt + 'invalid', secret);
        expect(decoded).toBeFalsy();
    })

    it('should return false when secret is invalid', () => {
        const sut = new JsonWebTokenJwtGenerator();
        const secret = 'ANY_SECRET';
        const jwt = sut.generateJwt({ field: 'any_value' }, secret, '1h');
        const decoded = sut.verify(jwt, 'INVALID_SECRET');
        expect(decoded).toBeFalsy();
    })
})