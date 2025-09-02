import EntityError from '../../error/entity.error';
import { Email } from '../email.vo';

describe('Email value object tests', () => {
   it('should throw if email is invalid', () => {
      expect(() => {
         const sut = new Email('invalid_email');
      }).toThrowError(new EntityError('Invalid email'));
   });

   it('should create email if email is valid', () => {
      const sut = new Email('valid_email@mail.com');
      expect(sut).toBeDefined();
   });

   it('should return the email value', () => {
      const sut = new Email('valid_email@mail.com');
      expect(String(sut)).toBe('valid_email@mail.com');
      expect(sut.toString()).toBe('valid_email@mail.com');
      expect(`${sut}`).toBe('valid_email@mail.com');
   });
});
