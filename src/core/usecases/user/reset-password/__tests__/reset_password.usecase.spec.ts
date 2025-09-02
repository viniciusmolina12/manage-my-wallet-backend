import User from '@core/domain/user/entity/user.entity';
import mockRepository from '../../__mocks__/repository.user.mock';
import { EncryptStub } from '../../__mocks__/stubs.user.mock';
import ResetPasswordUserUseCase from '../reset_password.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
import { Email } from '@core/domain/@shared/value-object/email.vo';

class UserWithResetToken extends User {
   resetPasswordToken: string = '';
   expiresIn: Date = new Date();
}
const user = new UserWithResetToken(
   'any_id',
   'any_name',
   new Email('any_email@mail.com'),
   'any_password'
);

describe('Reset password user usecase tests', () => {
   it('should reset user password', async () => {
      const encryptStub = new EncryptStub();
      const spy = jest.spyOn(encryptStub, 'encrypt');
      const spyUser = jest.spyOn(user, 'changePassword');
      user.resetPasswordToken = 'any_token';
      user.expiresIn = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
      mockRepository.findUserByResetPasswordToken.mockReturnValueOnce(user);
      spy.mockReturnValue('encrypted_password');
      const sut = new ResetPasswordUserUseCase(mockRepository, encryptStub);
      await sut.execute({
         token: 'any_token',
         password: 'any_other_password',
      });
      expect(spyUser).toHaveBeenCalledWith('encrypted_password');
   });

   it('should throw if user not found', async () => {
      mockRepository.findUserByResetPasswordToken.mockReturnValueOnce(null);
      const sut = new ResetPasswordUserUseCase(
         mockRepository,
         new EncryptStub()
      );
      await expect(
         sut.execute({ token: 'any_token', password: 'any_other_password' })
      ).rejects.toThrow(new EntityError('User not found'));
   });

   it('should throw if token expired', async () => {
      user.resetPasswordToken = 'any_token';
      user.expiresIn = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
      mockRepository.findUserByResetPasswordToken.mockReturnValueOnce(user);
      const sut = new ResetPasswordUserUseCase(
         mockRepository,
         new EncryptStub()
      );
      await expect(
         sut.execute({ token: 'any_token', password: 'any_other_password' })
      ).rejects.toThrow(new EntityError('Token expired'));
   });

   it('should call updateResetPasswordToken with correct values', async () => {
      user.expiresIn = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
      mockRepository.findUserByResetPasswordToken.mockReturnValue(user);
      const sut = new ResetPasswordUserUseCase(
         mockRepository,
         new EncryptStub()
      );
      await sut.execute({ token: 'any_token', password: 'any_other_password' });
      const [[_, __, expiresInArg]] =
         mockRepository.updateResetPasswordToken.mock.calls;
      expect(expiresInArg).not.toEqual(user.expiresIn);
   });
});
