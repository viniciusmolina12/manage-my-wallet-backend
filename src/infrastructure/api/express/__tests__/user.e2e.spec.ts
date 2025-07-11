import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import UserModel from '@infrastructure/db/mongodb/model/user.model';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   jest.clearAllMocks();
   await mockDb.clear();
});

afterAll(async () => {
   await mockDb.disconnect();
});
describe('User e2e tests', () => {
   describe('Create', () => {
      it('should create an user', async () => {
         const response = await request(app).post('/api/user').send({
            name: 'User test',
            email: 'any_email@mail.com',
            password: 'any_password',
            confirmPassword: 'any_password',
         });
         expect(response.status).toBe(201);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'User created successfully'
         );
         expect(response.body.data).toHaveProperty('id');
         expect(response.body.data).toHaveProperty('name', 'User test');
         expect(response.body.data).toHaveProperty(
            'email',
            'any_email@mail.com'
         );
      });
      it('should throw an error if email is invalid', async () => {
         const response = await request(app).post('/api/user').send({
            name: 'User test',
            email: 'invalid_email',
            password: 'any_password',
            confirmPassword: 'any_password',
         });
         expect(response.status).toBe(400);
         expect(response.body).not.toHaveProperty('data');
         expect(response.body).toHaveProperty('message', 'Invalid email');
      });

      it('should throw an error if required data is not provide (except email)', async () => {
         const response = await request(app).post('/api/user').send({
            email: 'email@mail.com',
         });
         expect(response.status).toBe(400);
         expect(response.body).not.toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'user: Name is required, user: Password is required, '
         );
      });

      it('should throw an error if password and confirm password do not match', async () => {
         const response = await request(app).post('/api/user').send({
            name: 'User test',
            email: 'any_email@mail.com',
            password: 'any_password',
            confirmPassword: 'other_password',
         });
         expect(response.status).toBe(400);
         expect(response.body).not.toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Password and confirm password do not match'
         );
      });
   });

   describe('Update', () => {
      it('should update an user', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password: 'any_password',
         });
         const response = await request(app).patch(`/api/user/any_id`).send({
            name: 'User test updated',
            email: 'any_mail_update@mail.com',
         });
         expect(response.status).toBe(200);
         expect(response.body).toEqual(
            expect.objectContaining({
               data: {
                  name: 'User test updated',
                  email: 'any_mail_update@mail.com',
                  updatedAt: expect.any(String),
               },
               message: 'User updated successfully',
            })
         );
      });
      it('should throw an error if user is not found', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password: 'any_password',
         });
         const response = await request(app)
            .patch('/api/user/any_other_id')
            .send({
               name: 'User test updated',
               email: 'any_email@mail.com',
            });

         expect(response.status).toBe(400);
         expect(response.body).not.toHaveProperty('data');
         expect(response.body).toHaveProperty('message', 'User not found');
      });
      it('should throw an error if email is invalid', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password: 'any_password',
         });
         const response = await request(app).patch(`/api/user/any_id`).send({
            name: 'User test updated',
            email: 'invalid_email',
         });
         expect(response.status).toBe(400);
         expect(response.body).not.toHaveProperty('data');
         expect(response.body).toHaveProperty('message', 'Invalid email');
      });

      it('should throw an error if email already exists', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password: 'any_password',
         });
         await UserModel.create({
            _id: 'any_other_id',
            email: 'email_testing@mail.com',
            name: 'any_name',
            password: 'any_password',
         });
         const response = await request(app).patch(`/api/user/any_id`).send({
            name: 'User test updated',
            email: 'email_testing@mail.com',
         });
         expect(response.status).toBe(400);
         expect(response.body).not.toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Email already exists'
         );
      });

      it('should throw an error if name is not provided', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_email@mail.com',
            name: 'any_name',
            password: 'any_password',
         });
         const response = await request(app).patch(`/api/user/any_id`).send({
            email: 'any_email@mail.com',
         });
         expect(response.status).toBe(400);
         expect(response.body).not.toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'user: Name is required, '
         );
      });

      it('should throw an error if email is not provided', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_email@mail.com',
            name: 'any_name',
            password: 'any_password',
         });
         const response = await request(app)
            .patch(`/api/user/any_id`)
            .send({ name: 'any_other_name' });
         expect(response.status).toBe(400);
         expect(response.body).not.toHaveProperty('data');
         expect(response.body).toHaveProperty('message', 'Invalid email');
      });
   });

   describe('Login', () => {
      it('should login succesfully', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password:
               '$2b$15$KvprO7kdKEFfQuVg4KJr8uLGLT1DYtBQ3Cb.EP.0Bo2CqrIJiNHR2',
         });
         const response = await request(app)
            .post(`/api/login`)
            .send({ email: 'any_mail@mail.com', password: 'any_password' });

         expect(response.status).toBe(200);
         expect(response.body).toMatchObject({
            data: {
               token: expect.any(String),
               user: {
                  id: 'any_id',
                  name: 'any_name',
                  email: 'any_mail@mail.com',
               },
            },
         });
      });

      it('should throw an error if email is invalid', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password:
               '$2b$15$KvprO7kdKEFfQuVg4KJr8uLGLT1DYtBQ3Cb.EP.0Bo2CqrIJiNHR2',
         });
         const response = await request(app).post(`/api/login`).send({
            email: 'any_other_email@mail.com',
            password: 'any_password',
         });

         expect(response.status).toBe(400);
         expect(response.body.message).toBe('Email or password is incorrect');
         expect(response.body).not.toHaveProperty('data');
      });

      it('should throw an error if password is invalid', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password:
               '$2b$15$KvprO7kdKEFfQuVg4KJr8uLGLT1DYtBQ3Cb.EP.0Bo2CqrIJiNHR2',
         });
         const response = await request(app).post(`/api/login`).send({
            email: 'any_mail@mail.com',
            password: 'wrong_password',
         });

         expect(response.status).toBe(400);
         expect(response.body.message).toBe('Email or password is incorrect');
         expect(response.body).not.toHaveProperty('data');
      });

      it('should throw an error if email is not provided', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password:
               '$2b$15$KvprO7kdKEFfQuVg4KJr8uLGLT1DYtBQ3Cb.EP.0Bo2CqrIJiNHR2',
         });
         const response = await request(app)
            .post(`/api/login`)
            .send({ password: 'any_password' });

         expect(response.status).toBe(400);
         expect(response.body.message).toBe('Email or password is incorrect');
         expect(response.body).not.toHaveProperty('data');
      });

      it('should throw an error if password is not provided', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password:
               '$2b$15$KvprO7kdKEFfQuVg4KJr8uLGLT1DYtBQ3Cb.EP.0Bo2CqrIJiNHR2',
         });
         const response = await request(app)
            .post(`/api/login`)
            .send({ email: 'any_mail@mail.com' });

         expect(response.status).toBe(400);
         expect(response.body.message).toBe('Email or password is incorrect');
         expect(response.body).not.toHaveProperty('data');
      });
   });

   describe('reset-password', () => {
      it('should reset password succesfully', async () => {
         const token = 'any_valid_token';
         const oldPassword = 'old_pasword';
         const newPassword = 'new_password';
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            resetPassword: {
               token,
               expiresIn: new Date().setDate(new Date().getDate() + 1),
            },
            password: oldPassword,
         });
         const response = await request(app)
            .post(`/api/user/reset-password`)
            .send({
               token,
               password: newPassword,
            });

         const userAfterChangePassword = await UserModel.findOne({
            _id: 'any_id',
         });

         expect(userAfterChangePassword?.password).not.toBe(oldPassword);
         expect(response.status).toBe(200);
         expect(response.body).toMatchObject({
            message: 'Password changed successfully',
         });
      });

      it('should throw an error if token does not exist', async () => {
         const response = await request(app)
            .post(`/api/user/reset-password`)
            .send({
               token: 'invalid_token',
               password: 'any_password',
            });
         expect(response.status).toBe(400);
         expect(response.body).toMatchObject({
            message: 'User not found',
         });
      });

      it('should throw an error if token is expired', async () => {
         const expired = new Date().setDate(new Date().getDate() - 1);
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            resetPassword: {
               token: 'any_token',
               expiresIn: expired,
            },
            password: 'any_password',
         });
         const response = await request(app)
            .post(`/api/user/reset-password`)
            .send({
               token: 'any_token',
               password: 'any_password',
            });
         expect(response.status).toBe(400);
         expect(response.body).toMatchObject({
            message: 'Token expired',
         });
      });

      it('should throw an error if token is not provided', async () => {
         const response = await request(app)
            .post(`/api/user/reset-password`)
            .send({
               password: 'any_password',
            });
         expect(response.status).toBe(400);
         expect(response.body).toMatchObject({
            message: 'Missing properties: token or password',
         });
      });

      it('should throw an error if password is not provided', async () => {
         const response = await request(app)
            .post(`/api/user/reset-password`)
            .send({
               token: 'any_token',
            });
         expect(response.status).toBe(400);
         expect(response.body).toMatchObject({
            message: 'Missing properties: token or password',
         });
      });

      it('should throw an error if tries to use the same token more than 1 time', async () => {
         const token = 'any_valid_token';
         const oldPassword = 'old_pasword';
         const newPassword = 'new_password';
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            resetPassword: {
               token,
               expiresIn: new Date().setDate(new Date().getDate() + 1),
            },
            password: oldPassword,
         });
         const response = await request(app)
            .post(`/api/user/reset-password`)
            .send({
               token,
               password: newPassword,
            });
         expect(response.status).toBe(200);
         //Retry to use the same token
         const retryResponse = await request(app)
            .post(`/api/user/reset-password`)
            .send({
               token,
               password: newPassword,
            });
         expect(retryResponse.status).toBe(400);
         expect(retryResponse.body).toMatchObject({
            message: 'Token expired',
         });
      });
   });

   describe('recover-password', () => {
      it('should recover password successfully', async () => {
         await UserModel.create({
            _id: 'any_id',
            email: 'any_mail@mail.com',
            name: 'any_name',
            password:
               '$2b$15$KvprO7kdKEFfQuVg4KJr8uLGLT1DYtBQ3Cb.EP.0Bo2CqrIJiNHR2',
         });
         const response = await request(app)
            .post(`/api/user/recover-password`)
            .send({ email: 'any_mail@mail.com' });

         expect((nodemailer as any).sendMailMock).toHaveBeenCalled();
         expect(response.status).toBe(200);
         expect(response.body).toMatchObject({
            message: 'Email sent successfully',
            data: { email: expect.any(String) },
         });
      });

      it('should throw an error if user not found', async () => {
         const response = await request(app)
            .post(`/api/user/recover-password`)
            .send({ email: 'invalid_email' });

         expect(response.status).toBe(400);
         expect(response.body).toMatchObject({
            message: 'User not found',
         });
      });
   });
});
