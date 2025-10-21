import { UserRepository } from '@core/domain/user/repository/user.repository';
import {
   InputRecoverPasswordUserDto,
   OutputRecoverPasswordUserDto,
} from './recover_password.user.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import Mailer from '@core/interfaces/mailer.interface';
import ENV from '@config/env';
import JwtGenerator from '@core/interfaces/jwtGenerator.interface';

export default class RecoverPasswordUserUseCase {
   constructor(
      private readonly userRepository: UserRepository,
      private readonly mailer: Mailer,
      private readonly jwtGenerator: JwtGenerator
   ) {
      this.userRepository = userRepository;
      this.mailer = mailer;
      this.jwtGenerator = jwtGenerator;
   }

   async execute(
      input: InputRecoverPasswordUserDto
   ): Promise<OutputRecoverPasswordUserDto> {
      const users = await this.userRepository.search({ email: input.email });
      if (!users.length) {
         throw new EntityError('User not found');
      }
      const user = users[0];
      const expiresIn = new Date(
         new Date().setHours(new Date().getHours() + 1)
      );
      const token = this.jwtGenerator.generateJwt(
         {
            name: user.name,
            email: user.email.toString(),
            type: 'recover-password',
         },
         ENV.SECRET_KEY,
         '1h'
      );
      await this.userRepository.createRecoveryData(
         user.email.toString(),
         token,
         expiresIn
      );
      await this.mailer.sendMail({
         to: user.email.toString(),
         from: ENV.FROM_EMAIL,
         subject: 'Password recovery',
         content: `<p>Hello ${user.name},</p><p><a href="${ENV.RESET_PASSWORD_URL}?token=${token}">Click here to reset your password</a></p>`,
      });
      await this.userRepository.updateResetPasswordToken(
         user,
         token,
         expiresIn
      );
      const censoredEmail = user.email
         .toString()
         .replace(
            /^(.)(.*)(?=@)/,
            (match, firstChar, hiddenPart) =>
               firstChar + '*'.repeat(hiddenPart.length)
         );
      return { email: censoredEmail };
   }
}
