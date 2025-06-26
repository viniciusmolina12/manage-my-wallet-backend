import User from '@core/domain/user/entity/user.entity';
import mockDb from '../__mocks__/mockDb';
import UserModel from '../../model/user.model';
import MongoDbUserRepository from './user.repository';
import { Email } from '@core/domain/@shared/value-object/email.vo';

beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   await mockDb.clear();
});

afterAll(async () => {
   await mockDb.disconnect();
});

describe('User repository tests', () => {
   it('should create an user', async () => {
      const user = new User(
         'any_id',
         'any_name',
         new Email('email@email.com'),
         'any_password'
      );
      const sut = new MongoDbUserRepository();
      await sut.create(user);
      const userCreated = await UserModel.findOne({ _id: user.id });
      expect(userCreated).toBeTruthy();
      expect(userCreated?.id).toBe(user.id);
      expect(userCreated?.name).toBe(user.name);
      expect(userCreated?.email).toBe(user.email.toString());
      expect(userCreated?.password).toBe(user.password);
   });

   it('should update an user', async () => {
      const model = await UserModel.create({
         _id: 'any_id',
         name: 'any_name',
         email: 'email@email.com',
         password: 'any_password',
      });

      const user = new User(
         model._id,
         'other_name',
         new Email('other_email@email.com'),
         'other_password'
      );
      const sut = new MongoDbUserRepository();
      await sut.update(user);
      const userUpdated = await UserModel.findOne({ _id: user.id });
      expect(userUpdated).toBeTruthy();
      expect(userUpdated?.id).toBe(user.id);
      expect(userUpdated?.name).toBe(user.name);
      expect(userUpdated?.email).toBe(user.email.toString());
      expect(userUpdated?.password).toBe(user.password);
   });

   it('should find an user', async () => {
      const model = await UserModel.create({
         _id: 'any_id',
         name: 'any_name',
         email: 'email@email.com',
         password: 'any_password',
      });

      const sut = new MongoDbUserRepository();
      const user = await sut.find(model._id);
      expect(user).toBeTruthy();
      expect(user?.id).toBe(model._id);
      expect(user?.name).toBe(model.name);
      expect(user?.email.toString()).toBe(model.email);
      expect(user?.password).toBe(model.password);
      expect(user?.createdAt).toBeDefined();
      expect(user?.updatedAt).toBeDefined();
   });

   it('should create a recovery data', async () => {
      const model = await UserModel.create({
         _id: 'any_id',
         name: 'any_name',
         email: 'email@email.com',
         password: 'any_password',
      });

      const sut = new MongoDbUserRepository();
      const expiresIn = new Date();
      await sut.createRecoveryData(model.email, 'any_token', expiresIn);
      const user = await UserModel.findOne({ email: model.email });
      expect(user).toBeTruthy();
      expect(user?.resetPassword?.token).toBe('any_token');
      expect(user?.resetPassword?.expiresIn).toEqual(expiresIn);
   });

   it('should find a user by reset password token', async () => {
      const model = await UserModel.create({
         _id: 'any_id',
         name: 'any_name',
         email: 'email@email.com',
         password: 'any_password',
      });

      const sut = new MongoDbUserRepository();
      const expiresIn = new Date();
      await sut.createRecoveryData(model.email, 'any_token', expiresIn);
      const user = await sut.findUserByResetPasswordToken('any_token');
      expect(user).toBeTruthy();
      expect(user?.id).toBe(model._id);
      expect(user?.resetPasswordToken).toBe('any_token');
      expect(user?.expiresIn).toEqual(expiresIn);
   });

   it('should update a reset password token', async () => {
      const model = await UserModel.create({
         _id: 'any_id',
         name: 'any_name',
         email: 'email@email.com',
         password: 'any_password',
      });
      const user = new User(
         model._id,
         model.name,
         new Email(model.email),
         model.password
      );
      const sut = new MongoDbUserRepository();
      const expiresIn = new Date();
      await sut.updateResetPasswordToken(user, 'any_token', expiresIn);
      const userUpdated = await UserModel.findOne({ email: model.email });
      expect(userUpdated).toBeTruthy();
      expect(userUpdated?.resetPassword?.token).toBe('any_token');
      expect(userUpdated?.resetPassword?.expiresIn).toEqual(expiresIn);
   });

   it('should search an user', async () => {
      const model = await UserModel.create({
         _id: 'any_id',
         name: 'any_name',
         email: 'email@email.com',
         password: 'any_password',
      });
      const sut = new MongoDbUserRepository();
      const user = await sut.search({ email: model.email });
      expect(user).toBeTruthy();
      expect(user[0].id).toBe(model._id);
      expect(user[0].name).toBe(model.name);
      expect(user[0].email.toString()).toBe(model.email);
      expect(user[0].password).toBe(model.password);
   });

   it('should get a recovery data', async () => {
      const model = await UserModel.create({
         _id: 'any_id',
         name: 'any_name',
         email: 'email@email.com',
         password: 'any_password',
         resetPassword: {
            token: 'any_token',
            expiresIn: new Date(),
         },
      });
      const sut = new MongoDbUserRepository();
      const recoveryData = await sut.getRecoveryData(model.email);
      expect(recoveryData).toBeTruthy();
      expect(recoveryData?.token).toBe(model.resetPassword?.token);
      expect(recoveryData?.expiresIn).toEqual(model.resetPassword?.expiresIn);
   });

   it('should delete an user', async () => {
      const model = await UserModel.create({
         _id: 'any_id',
         name: 'any_name',
         email: 'email@email.com',
         password: 'any_password',
      });
      const sut = new MongoDbUserRepository();
      await sut.delete(model._id);
      const user = await UserModel.findOne({ _id: model._id });
      expect(user).toBeNull();
   });
});
