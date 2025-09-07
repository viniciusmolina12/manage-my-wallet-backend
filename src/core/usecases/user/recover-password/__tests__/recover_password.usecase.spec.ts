import User, { UserId } from '@core/domain/user/entity/user.entity';
import mockRepository from '../../__mocks__/repository.user.mock';
import { JwtGeneratorStub, MailerStub } from '../../__mocks__/stubs.user.mock';
import RecoverPasswordUserUseCase from '../recover_password.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
import ENV from '@config/env';
import { Email } from '@core/domain/@shared/value-object/email.vo';

interface SutTypes {
   mailerStub: MailerStub;
   jwtStub: JwtGeneratorStub;
   sut: RecoverPasswordUserUseCase;
}
const makeSut = (): SutTypes => {
   const mailerStub = new MailerStub();
   const jwtStub = new JwtGeneratorStub();
   const sut = new RecoverPasswordUserUseCase(
      mockRepository,
      mailerStub,
      jwtStub
   );
   return {
      sut,
      mailerStub,
      jwtStub,
   };
};
describe('Recover user password usecase tests', () => {
   it('should be able to recover user password', async () => {
      const { sut } = makeSut();
      mockRepository.search.mockReturnValueOnce(
         Promise.resolve([
            new User(
               new UserId(),
               'any_name',
               new Email('any_email@mail.com'),
               'any_password'
            ),
         ])
      );
      const result = await sut.execute({ email: 'any_email@mail.com' });
      expect(result).toEqual({ email: 'a********@mail.com' });
   });

   it('should throw if user not found', async () => {
      const { sut } = makeSut();
      await expect(
         sut.execute({ email: 'any_email@mail.com' })
      ).rejects.toThrow(new EntityError('User not found'));
   });

   it('should call generatePasswordRecoverToken method with correct values', async () => {
      const { sut, jwtStub } = makeSut();
      mockRepository.search.mockReturnValueOnce(
         Promise.resolve([
            new User(
               new UserId(),
               'any_name',
               new Email('any_email@mail.com'),
               'any_password'
            ),
         ])
      );
      const generatePasswordRecoverTokenSpy = jest.spyOn(
         jwtStub,
         'generateJwt'
      );
      await sut.execute({ email: 'any_email@mail.com' });
      expect(generatePasswordRecoverTokenSpy).toHaveBeenCalledWith(
         {
            email: 'any_email@mail.com',
            name: 'any_name',
            type: 'recover-password',
         },
         ENV.SECRET_KEY,
         '1h'
      );
   });

   it('should call createRecoveryData method with correct values', async () => {
      const { sut } = makeSut();
      mockRepository.search.mockReturnValueOnce(
         Promise.resolve([
            new User(
               new UserId(),
               'any_name',
               new Email('any_email@mail.com'),
               'any_password'
            ),
         ])
      );
      const createRecoveryDataSpy = jest.spyOn(
         mockRepository,
         'createRecoveryData'
      );
      await sut.execute({ email: 'any_email@mail.com' });
      expect(createRecoveryDataSpy).toHaveBeenCalledWith(
         'any_email@mail.com',
         'any_token',
         expect.any(Date)
      );
   });

   it('should call jwt generator with correct values', async () => {
      const { sut, jwtStub } = makeSut();
      mockRepository.search.mockReturnValueOnce(
         Promise.resolve([
            new User(
               new UserId(),
               'any_name',
               new Email('any_email@mail.com'),
               'any_password'
            ),
         ])
      );
      const spy = jest.spyOn(jwtStub, 'generateJwt');
      await sut.execute({ email: 'any_email@mail.com' });
      expect(spy).toHaveBeenCalledWith(
         {
            email: 'any_email@mail.com',
            name: 'any_name',
            type: 'recover-password',
         },
         ENV.SECRET_KEY,
         '1h'
      );
   });
});
