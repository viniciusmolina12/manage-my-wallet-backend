import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import BillModel from '@infrastructure/db/mongodb/model/bill.model';

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

})


