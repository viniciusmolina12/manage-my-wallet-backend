import { UserRepository } from '@core/domain/user/repository/user.repository';
import { InputUpdateUserDto, OutputUpdateUserDto } from './update.user.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import { Email } from '@core/domain/@shared/value-object/email.vo';

export default class UpdateUserUseCase {
   constructor(private readonly userRepository: UserRepository) {}

   async execute(input: InputUpdateUserDto): Promise<OutputUpdateUserDto> {
      const user = await this.userRepository.find(input.id);
      if (!user) throw new EntityError('User not found');

      const users = await this.userRepository.search({
         email: input.email,
      });
      const hasUserWithSameEmail = users.some(
         (user) => user.email.toString() === input.email && user.id !== input.id
      );
      if (hasUserWithSameEmail) {
         throw new EntityError('Email already exists');
      }

      const email = new Email(input.email);
      user.changeName(input.name);
      user.changeEmail(email);
      await this.userRepository.update(user);

      return {
         name: user.name,
         email: user.email.toString(),
         updatedAt: user.updatedAt,
      };
   }
}
