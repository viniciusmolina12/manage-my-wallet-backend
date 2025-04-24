import Encrypt from '@core/domain/interfaces/encrypt.interface';
import { UserRepository } from '@core/domain/user/repository/user.repository';
import {
   InputResetPasswordUserDto,
   OutputResetPasswordUserDto,
} from './reset_password.user.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import CONSTANTS from '@config/constants';

export default class ResetPasswordUserUseCase {
   constructor(
      private readonly userRepository: UserRepository,
      private readonly encrypt: Encrypt
   ) {
      this.userRepository = userRepository;
      this.encrypt = encrypt;
   }

   async execute(
      input: InputResetPasswordUserDto
   ): Promise<OutputResetPasswordUserDto> {
      const { token, password } = input;
      if (!token || !password)
         throw new EntityError('Missing properties: token or password');
      const user =
         await this.userRepository.findUserByResetPasswordToken(token);

      if (!user) {
         throw new EntityError('User not found');
      }
      const now = new Date();
      if (!user.expiresIn || now >= user.expiresIn) {
         throw new EntityError('Token expired');
      }

      const encryptPassword = this.encrypt.encrypt(
         password,
         CONSTANTS.SALTS_ROUND
      ) as string;
      user.changePassword(encryptPassword);
      await this.userRepository.update(user);
   }
}
