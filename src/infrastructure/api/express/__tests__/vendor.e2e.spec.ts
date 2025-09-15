import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
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
         expect(response.body.data.id).toBeDefined();
         expect(response.body.data.name).toBe('Vendor 1');
         expect(response.body.data.createdAt).toBeDefined();
         expect(response.body.data.updatedAt).toBeDefined();
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
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Vendor 1',
            userId: '123e4567-e89b-12d3-a456-426614174000',
         });
         const response = await request(app)
            .post('/api/vendor')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Vendor 1' });
         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty(
            'message',
            'Vendor already exists'
         );
      });
   });

   describe('/api/vendor/:id GET', () => {
      it('should return a vendor', async () => {
         await vendorModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Vendor 1',
            userId: '123e4567-e89b-12d3-a456-426614174000',
         });
         const response = await request(app)
            .get('/api/vendor/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', 'Bearer ' + token);
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Vendor found successfully'
         );
         expect(response.body.data.id).toBeDefined();
         expect(response.body.data.name).toBe('Vendor 1');
         expect(response.body.data.createdAt).toBeDefined();
         expect(response.body.data.updatedAt).toBeDefined();
      });

      it('should return an error when vendor is not found', async () => {
         const response = await request(app)
            .get('/api/vendor/any_hash_id')
            .set('Authorization', 'Bearer ' + token);
         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty('message', 'Vendor not found');
      });
   });

   describe('/api/vendor GET', () => {
      it('should return a list of vendors', async () => {
         await vendorModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Vendor 1',
            userId: '123e4567-e89b-12d3-a456-426614174000',
         });
         await vendorModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Vendor 2',
            userId: '123e4567-e89b-12d3-a456-426614174000',
         });
         const response = await request(app)
            .get('/api/vendors')
            .set('Authorization', 'Bearer ' + token);
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Vendors listed successfully'
         );
         expect(response.body.data.vendors).toHaveLength(2);
         expect(response.body.data.vendors[0].id).toBe(
            '123e4567-e89b-12d3-a456-426614174000'
         );
         expect(response.body.data.vendors[0].name).toBe('Vendor 1');
         expect(response.body.data.vendors[0].createdAt).toBeDefined();
         expect(response.body.data.vendors[0].updatedAt).toBeDefined();
         expect(response.body.data.vendors[1].id).toBe(
            '123e4567-e89b-12d3-a456-426614174001'
         );
         expect(response.body.data.vendors[1].name).toBe('Vendor 2');
         expect(response.body.data.vendors[1].createdAt).toBeDefined();
         expect(response.body.data.vendors[1].updatedAt).toBeDefined();
      });

      it('should return an empty array when user has no vendors', async () => {
         const response = await request(app)
            .get('/api/vendors')
            .set('Authorization', 'Bearer ' + token);
         expect(response.status).toBe(200);
         expect(response.body.data.vendors).toHaveLength(0);
      });
   });

   describe('/api/vendor/:id DELETE', () => {
      it('should delete a vendor', async () => {
         await vendorModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Vendor 1',
            userId: '123e4567-e89b-12d3-a456-426614174000',
         });
         const response = await request(app)
            .delete('/api/vendor/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', 'Bearer ' + token);
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty(
            'message',
            'Vendor deleted successfully'
         );
      });

      it('should return an error when vendor is not found', async () => {
         const response = await request(app)
            .delete('/api/vendor/any_hash_id')
            .set('Authorization', 'Bearer ' + token);
         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty('message', 'Vendor not found');
      });
   });

   describe('/api/vendor/:id PUT', () => {
      it('should update a vendor', async () => {
         await vendorModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Vendor 1',
            userId: '123e4567-e89b-12d3-a456-426614174000',
         });
         const response = await request(app)
            .put('/api/vendor/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Vendor 2' });
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data.id).toBe(
            '123e4567-e89b-12d3-a456-426614174000'
         );
         expect(response.body.data.name).toBe('Vendor 2');
         expect(response.body.data.createdAt).toBeDefined();
         expect(response.body.data.updatedAt).toBeDefined();
         expect(response.body).toHaveProperty(
            'message',
            'Vendor updated successfully'
         );
      });

      it('should return an error when vendor is not found', async () => {
         const response = await request(app)
            .put('/api/vendor/any_hash_id')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Vendor 2' });
         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty('message', 'Vendor not found');
      });

      it('should return an error when vendor name already exists', async () => {
         await vendorModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Vendor 1',
            userId: '123e4567-e89b-12d3-a456-426614174000',
         });
         const response = await request(app)
            .put('/api/vendor/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Vendor 1' });
         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty(
            'message',
            'Vendor name already exists'
         );
      });
   });
});
