import { RepositoryInterface } from '../../@shared/repository.interface';
import User from '../entity/user.entity';

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
   ): Promise<(User & { resetPasswordToken: string; expiresIn?: Date }) | null>;
   updateResetPasswordToken(
      user: User,
      resetPasswordToken: string,
      expiresIn: Date
   ): Promise<void>;
}
