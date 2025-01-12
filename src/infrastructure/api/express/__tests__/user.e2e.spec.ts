import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import UserModel from '@infrastructure/db/mongodb/model/user.model';
import User from '@core/domain/user/entity/user.entity';

beforeAll(async () => {
    await mockDb.connect();
})

beforeEach(async () => {
    await mockDb.clear();
})

afterAll(async () => {
    await mockDb.disconnect();
})
describe('User e2e tests', () => {
    describe('Create', () => {
        it('should create an user', async () => {
            const response = await request(app)
                .post('/api/user')
                .send({
                    name: 'User test',
                    email: 'any_email@mail.com',
                    password: 'any_password'
                })
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('message', 'User created successfully');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('name', 'User test');
            expect(response.body.data).toHaveProperty('email', 'any_email@mail.com');
        })
        it('should throw an error if email is invalid', async () => {
            const response = await request(app)
                .post('/api/user')
                .send({
                    name: 'User test',
                    email: 'invalid_email',
                    password: 'any_password'
                })
            expect(response.status).toBe(400);
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('message', 'user: Email is invalid, ');
        })

        it('should throw an error if required data is not provided', async () => {
            const response = await request(app)
                .post('/api/user')
                .send({})
            expect(response.status).toBe(400);
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('message', 'user: Name is required, user: Email is required, user: Email is invalid, user: Password is required, ');
        })
    })

    describe('Update', () => {

        it('should update an user', async () => {
            await UserModel.create({ _id: 'any_id', email: 'any_mail@mail.com', name: 'any_name', password: 'any_password' });
            const response = await request(app)
                .patch(`/api/user/any_id`)
                .send({
                    name: 'User test updated',
                    email: 'any_mail_update@mail.com'
                })
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                data: {
                    name: 'User test updated',
                    email: 'any_mail_update@mail.com',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
                message: 'User updated successfully'
            }))

        })
        it('should throw an error if user is not found', async () => {
            await UserModel.create({ _id: 'any_id', email: 'any_mail@mail.com', name: 'any_name', password: 'any_password' });
            const response = await request(app)
                .patch('/api/user/any_other_id')
                .send({
                    name: 'User test updated',
                    email: 'any_email@mail.com',
                })
            
            expect(response.status).toBe(400);
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('message', 'User not found');
        })
        it('should throw an error if email is invalid', async () => {
            await UserModel.create({ _id: 'any_id', email: 'any_mail@mail.com', name: 'any_name', password: 'any_password' });
            const response = await request(app)
                .patch(`/api/user/any_id`)
                .send({
                    name: 'User test updated',
                    email: 'invalid_email',
                })
            expect(response.status).toBe(400);
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('message', 'user: Email is invalid, ');
        })

        it('should throw an error if email already exists', async () => {
            await UserModel.create({ _id: 'any_id', email: 'any_mail@mail.com', name: 'any_name', password: 'any_password' });
            await UserModel.create({ _id: 'any_other_id', email: 'email_testing@mail.com', name: 'any_name', password: 'any_password' });
            const response = await request(app)
                .patch(`/api/user/any_id`)
                .send({
                    name: 'User test updated',
                    email: 'email_testing@mail.com',
                })
            expect(response.status).toBe(400);
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('message', 'Email already exists');
        })

        it('should throw an error if name is not provided', async () => {
            await UserModel.create({ _id: 'any_id', email: 'any_email@mail.com', name: 'any_name', password: 'any_password' });
            const response = await request(app)
                .patch(`/api/user/any_id`)
                .send({})
            expect(response.status).toBe(400);
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('message', 'user: Name is required, ');
        })

        it('should throw an error if email is not provided', async () => {
            await UserModel.create({ _id: 'any_id', email: 'any_email@mail.com', name: 'any_name', password: 'any_password' });
            const response = await request(app)
                .patch(`/api/user/any_id`)
                .send({ name: 'any_other_name' })
            expect(response.status).toBe(400);
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('message', 'user: Email is required, user: Email is invalid, ');
        })
    })
})


