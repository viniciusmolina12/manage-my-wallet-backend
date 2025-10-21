import { UserRepository } from '@core/domain/user/repository/user.repository';
import { InputLoginUserDto, OutputLoginUserDto } from './login.user.dto';
import Encrypt from '@core/interfaces/encrypt.interface';
import JwtGenerator from '@core/interfaces/jwtGenerator.interface';
import EntityError from '@core/domain/@shared/error/entity.error';
import ENV from '@config/env';

export default class LoginUserUseCase {
   constructor(
      private readonly userRepository: UserRepository,
      private readonly encrypt: Encrypt,
      private readonly jwtGenerator: JwtGenerator
   ) {}

   async execute(input: InputLoginUserDto): Promise<OutputLoginUserDto> {
      const users = await this.userRepository.search({
         email: input.email,
      });
      if (users.length === 0) {
         throw new EntityError('Email or password is incorrect');
      }
      const user = users[0];
      const isPasswordValid = this.encrypt.compare(
         input.password,
         user.password
      );
      if (!isPasswordValid) {
         throw new EntityError('Email or password is incorrect');
      }
      const token = this.jwtGenerator.generateJwt(
         { id: user.id, email: user.email.toString(), name: user.name },
         ENV.SECRET_KEY,
         '1h'
      );

      return {
         user: {
            id: user.id,
            name: user.name,
            email: user.email.toString(),
         },
         token,
      };
   }
}
