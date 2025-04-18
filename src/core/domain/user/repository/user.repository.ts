import { RepositoryInterface } from '../../@shared/repository.interface';
import User from '../entity/user.entity';

export class UserWithResetToken extends User {
   constructor(
      public resetPasswordToken: string,
      public expiresIn: Date,
      id: string,
      name: string,
      email: string,
      password: string
   ) {
      super(id, name, email, password);
   }
}

export interface UserRepository
   extends Omit<RepositoryInterface<User>, 'findAll'> {
   search(filter: { name?: string; email?: string }): Promise<User[]>;
   getRecoveryData(
      email: string
   ): Promise<{ token: string; expiresIn: Date } | null>;
   createRecoveryData(
      email: string,
      token: string,
      expiresIn: Date
   ): Promise<void>;
   findUserByResetPasswordToken(
      resetPasswordToken: string
   ): Promise<UserWithResetToken | null>;
   updateResetPasswordToken(
      user: User,
      resetPasswordToken: string,
      expiresIn: Date
   ): Promise<void>;
}
