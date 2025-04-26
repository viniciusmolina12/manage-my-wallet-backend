import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import CategoryModel from '@infrastructure/db/mongodb/model/category.model';
import token from './___mocks__/jsonwebtoken.mock';
import vendorModel from '@infrastructure/db/mongodb/model/vendor.model';
beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   await mockDb.clear();
});

afterAll(async () => {
   await mockDb.disconnect();
});

describe('Vendor e2e tests', () => {
   describe('/api/vendor POST', () => {
      it('should create a vendor', async () => {
         const response = await request(app)
            .post('/api/vendor')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Vendor 1' });
         expect(response.status).toBe(201);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Vendor created successfully'
         );
      });

      it('should return an error when creating a vendor with invalid data', async () => {
         const response = await request(app)
            .post('/api/vendor')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: '' });
         expect(response.status).toBe(400);
      });

      it('should throw an error if vendor already exists', async () => {
         await vendorModel.create({
            _id: 'any_hash_id',
            name: 'Vendor 1',
            userId: 'any_user_id',
         });
         const response = await request(app)
            .post('/api/vendor')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Vendor 1' });
         console.log(response.body);
         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty(
            'message',
            'Vendor already exists'
         );
      });
   });
});
