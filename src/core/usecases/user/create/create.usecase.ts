import { v4 as uuid } from 'uuid';
import User from '@core/domain/user/entity/user.entity';
import Encrypt from '@core/domain/interfaces/encrypt.interface';
import CONSTANTS from '@config/constants';
import { UserRepository } from '@core/domain/user/repository/user.repository';
import { InputCreateUserDto, OutputCreateUserDto } from './create.user.dto';
import JwtGenerator from '@core/domain/interfaces/jwtGenerator.interface';
import EntityError from '@core/domain/@shared/error/entity.error';
import ENV from '@config/env';

export default class CreateUserUseCase {
   constructor(
      private readonly userRepository: UserRepository,
      private readonly encrypt: Encrypt,
      private readonly jwtGenerator: JwtGenerator
   ) {
      this.userRepository = userRepository;
      this.encrypt = encrypt;
      this.jwtGenerator = jwtGenerator;
   }
   async execute(input: InputCreateUserDto): Promise<OutputCreateUserDto> {
      const user = new User(
         uuid(),
         input.name,
         input.email,
         this.encrypt.encrypt(input.password, CONSTANTS.SALTS_ROUND) as string
      );
      const userExists = await this.userRepository.search({
         email: input.email,
      });
      if (userExists.length > 0) throw new EntityError('User already exists');
      const token = this.jwtGenerator.generateJwt(
         { id: user.id, name: user.name, email: user.email },
         ENV.SECRET_KEY,
         '1h'
      );
      await this.userRepository.create(user);
      return {
         id: user.id,
         name: user.name,
         email: user.email,
         token,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
   }
}
