import EntityError from '@core/domain/@shared/error/entity.error';
import User from './user.entity';
import { Email } from '../../../domain/@shared/value-object/email.vo';

describe('User entity tests', () => {
   it('should throw if id is empty', () => {
      expect(() => {
         const sut = new User(
            '',
            'any_name',
            new Email('any_email@mail.com'),
            'any_password'
         );
      }).toThrowError(new EntityError('user: Id is required, '));
   });

   it('should throw if name is empty', () => {
      expect(() => {
         const sut = new User(
            'any_id',
            '',
            new Email('any_email@mail.com'),
            'any_password'
         );
      }).toThrowError(new EntityError('user: Name is required, '));
   });

   it('should throw if email is invalid', () => {
      expect(() => {
         const sut = new User(
            'any_id',
            'any_name',
            new Email('any_email_invalid.invalid'),
            'any_password'
         );
      }).toThrowError(new EntityError('Invalid email'));
   });

   it('should throw if password is empty', () => {
      expect(() => {
         const sut = new User(
            'any_id',
            'any_name',
            new Email('any_email@mail.com'),
            ''
         );
      }).toThrowError(new EntityError('user: Password is required, '));
   });

   it('should change name', () => {
      const sut = new User(
         'any_id',
         'any_name',
         new Email('any_email@mail.com'),
         'any_password'
      );
      sut.changeName('new_name');
      expect(sut.name).toBe('new_name');
   });

   it('should change email', () => {
      const sut = new User(
         'any_id',
         'any_name',
         new Email('any_email@mail.com'),
         'any_password'
      );
      sut.changeEmail(new Email('new_mail@mail.com'));
      expect(sut.email.toString()).toBe('new_mail@mail.com');
   });

   it('should change password', () => {
      const sut = new User(
         'any_id',
         'any_name',
         new Email('any_email@mail.com'),
         'any_password'
      );
      sut.changePassword('new_password');
      expect(sut.password).toBe('new_password');
   });
});
