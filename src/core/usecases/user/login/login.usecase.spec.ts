import Encrypt from '@core/domain/interfaces/encrypt.interface';
import JwtGenerator from '@core/domain/interfaces/jwtGenerator.interface';
import LoginUserUseCase from './login.usecase';
import User from '@core/domain/user/entity/user.entity';
import EntityError from '@core/domain/@shared/error/entity.error';
import { EncryptStub, JwtGeneratorStub } from '../__mocks__/stubs.user.mock';
import mockRepository from '../__mocks__/repository.user.mock';
interface SutTypes {
   encryptStub: Encrypt;
   jwtGeneratorStub: JwtGenerator;
   sut: LoginUserUseCase;
}
const makeSut = (): SutTypes => {
   const encryptStub = new EncryptStub();
   const jwtGeneratorStub = new JwtGeneratorStub();
   const sut = new LoginUserUseCase(
      mockRepository,
      encryptStub,
      jwtGeneratorStub
   );
   return {
      sut,
      encryptStub,
      jwtGeneratorStub,
   };
};
describe('Login usecase tests', () => {
   it('should login succesfully', async () => {
      const { sut } = makeSut();
      mockRepository.search.mockReturnValueOnce(
         Promise.resolve([
            new User(
               'any_id',
               'any_name',
               'any_email@mail.com',
               'encrypted_password'
            ),
         ])
      );
      const result = await sut.execute({
         email: 'any_email@mail.com',
         password: 'encrypted_password',
      });
      expect(result.token).toBe('any_token');
      expect(result.user.id).toBe('any_id');
      expect(result.user.name).toBe('any_name');
      expect(result.user.email).toBe('any_email@mail.com');
   });

   it('should throw an error if user does not exist', async () => {
      const { sut } = makeSut();
      await expect(
         sut.execute({
            email: 'any_email@mail.com',
            password: 'encrypted_password',
         })
      ).rejects.toThrow(new EntityError('Email or password is invalid'));
   });

   it('should throw an error if password is invalid', async () => {
      const { sut, encryptStub } = makeSut();
      encryptStub.compare = jest.fn().mockReturnValueOnce(false);
      mockRepository.search.mockReturnValueOnce(
         Promise.resolve([
            new User(
               'any_id',
               'any_name',
               'any_email@mail.com',
               'any_password'
            ),
         ])
      );
      await expect(
         sut.execute({
            email: 'any_email@mail.com',
            password: 'any_other_password',
         })
      ).rejects.toThrow(new EntityError('Email or password is invalid'));
   });
});
