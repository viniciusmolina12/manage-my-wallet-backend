import User from '@core/domain/user/entity/user.entity';
import UpdateUserUseCase from './update.usecase';
import mockRepository from '../__mocks__/repository.user.mock';
import { Email } from '@core/domain/@shared/value-object/email.vo';

const input = {
   id: 'any_id',
   name: 'any_other_name',
   email: 'any_other_email@mail.com',
};

describe('Update user usecase tests', () => {
   it('should update an user', async () => {
      const sut = new UpdateUserUseCase(mockRepository);
      mockRepository.find.mockReturnValueOnce(
         new User(
            'any_id',
            'any_name',
            new Email('any_email@mail.com'),
            'any_password'
         )
      );
      const user = await sut.execute(input);
      expect(user).toBeTruthy();
      expect(user.name).toBe('any_other_name');
      expect(user.email).toBe('any_other_email@mail.com');
   });

   it('should throw an error if user not found', async () => {
      const sut = new UpdateUserUseCase(mockRepository);
      await expect(sut.execute(input)).rejects.toThrow('User not found');
   });

   it('should throw an error if email already exists', async () => {
      const sut = new UpdateUserUseCase(mockRepository);
      mockRepository.find.mockReturnValueOnce(
         new User(
            'any_id',
            'any_name',
            new Email('any_email@mail.com'),
            'any_password'
         )
      );
      mockRepository.search.mockReturnValueOnce(
         Promise.resolve([
            {
               id: 'any_other_id',
               name: 'any_name',
               email: 'any_other_email@mail.com',
               userName: 'any_username',
               password: 'encrypted_password',
            },
         ])
      );
      await expect(sut.execute(input)).rejects.toThrow('Email already exists');
   });

   it('should throw an error if name is empty', async () => {
      const sut = new UpdateUserUseCase(mockRepository);
      const wrongInput = { ...input, name: '' };
      mockRepository.find.mockReturnValueOnce(
         new User(
            'any_id',
            'any_name',
            new Email('any_email@mail.com'),
            'any_password'
         )
      );
      await expect(sut.execute(wrongInput)).rejects.toThrow(
         'user: Name is required, '
      );
   });

   it('should throw an error if email is empty', async () => {
      const sut = new UpdateUserUseCase(mockRepository);
      const wrongInput = { ...input, email: '' };
      mockRepository.find.mockReturnValueOnce(
         new User(
            'any_id',
            'any_name',
            new Email('any_email@mail.com'),
            'any_password'
         )
      );
      await expect(sut.execute(wrongInput)).rejects.toThrow('Invalid email');
   });

   it('should throw an error if email is invalid', async () => {
      const sut = new UpdateUserUseCase(mockRepository);
      const wrongInput = { ...input, email: 'invalid_email' };
      mockRepository.find.mockReturnValueOnce(
         new User(
            'any_id',
            'any_name',
            new Email('any_email@mail.com'),
            'any_password'
         )
      );
      await expect(sut.execute(wrongInput)).rejects.toThrow('Invalid email');
   });
});
