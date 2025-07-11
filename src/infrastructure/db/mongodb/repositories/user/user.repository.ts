import User from '@core/domain/user/entity/user.entity';
import {
   UserRepository,
   UserWithResetToken,
} from '@core/domain/user/repository/user.repository';
import UserModel from '../../model/user.model';
import { Email } from '@core/domain/@shared/value-object/email.vo';

export default class MongoDbUserRepository implements UserRepository {
   async create(entity: User): Promise<void> {
      await UserModel.create({
         _id: entity.id,
         name: entity.name,
         email: entity.email.toString(),
         password: entity.password,
      });
   }

   async update(entity: User): Promise<void | User> {
      const a = await UserModel.findOneAndUpdate(
         { _id: entity.id },
         {
            email: entity.email.toString(),
            password: entity.password,
            name: entity.name,
            updatedAt: new Date(),
         }
      );
   }

   async find(id: string): Promise<User | null> {
      const user = await UserModel.findOne({ _id: id });
      if (!user) return null;
      const userFound = new User(
         user.id,
         user.name,
         new Email(user.email),
         user.password
      );
      userFound.createdAt = user.createdAt;
      userFound.updatedAt = user.updatedAt;
      return userFound;
   }

   async createRecoveryData(
      email: string,
      token: string,
      expiresIn: Date
   ): Promise<void> {
      await UserModel.findOneAndUpdate(
         { email },
         { resetPassword: { token, expiresIn } }
      );
   }

   async findUserByResetPasswordToken(
      resetPasswordToken: string
   ): Promise<UserWithResetToken | null> {
      const userFound = await UserModel.findOne({
         'resetPassword.token': resetPasswordToken,
      });
      if (!userFound) return null;

      return new UserWithResetToken(
         resetPasswordToken,
         userFound.resetPassword?.expiresIn as Date,
         userFound.id,
         userFound.name,
         new Email(userFound.email),
         userFound.password
      );
   }

   async updateResetPasswordToken(
      user: User,
      resetPasswordToken: string,
      expiresIn: Date
   ): Promise<void> {
      await UserModel.findOneAndUpdate(
         { _id: user.id },
         { resetPassword: { token: resetPasswordToken, expiresIn } }
      );
   }

   async search(filter: {
      name?: string | undefined;
      email?: string | undefined;
   }): Promise<User[]> {
      const user = await UserModel.find(filter);
      const users = user.map((user) => {
         const userFound = new User(
            user.id,
            user.name,
            new Email(user.email),
            user.password
         );
         userFound.createdAt = user.createdAt;
         userFound.updatedAt = user.updatedAt;
         return userFound;
      });
      return users;
   }

   async getRecoveryData(
      email: string
   ): Promise<{ token: string; expiresIn: Date } | null> {
      const user = await UserModel.findOne({ email });
      if (!user) return null;
      return {
         token: user?.resetPassword?.token as string,
         expiresIn: user?.resetPassword?.expiresIn as Date,
      };
   }

   async delete(id: string): Promise<void> {
      await UserModel.deleteOne({ _id: id });
   }
}
