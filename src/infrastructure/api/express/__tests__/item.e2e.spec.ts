import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import ItemModel from '@infrastructure/db/mongodb/model/item.model';
import token from './___mocks__/jsonwebtoken.mock';
beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   await mockDb.clear();
});

afterAll(async () => {
   await mockDb.disconnect();
});
describe('Item e2e tests', () => {
   it('should create an item', async () => {
      const response = await request(app)
         .post('/api/item')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_item_name',
            description: 'any_item_description',
            categoryId: '123e4567-e89b-12d3-a456-426614174000',
         });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Item created successfully'
      );
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', 'any_item_name');
      expect(response.body.data).toHaveProperty(
         'description',
         'any_item_description'
      );
      expect(response.body.data).toHaveProperty(
         'categoryId',
         '123e4567-e89b-12d3-a456-426614174000'
      );
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
   });

   it('should return an error when creating an item with invalid data', async () => {
      const response = await request(app)
         .post('/api/item')
         .set('Authorization', 'Bearer ' + token)
         .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Name is required');
      expect(response.body.message).toContain('CategoryId is required');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should return an error when creating an item with an existing name', async () => {
      await ItemModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Item 1',
         description: 'Description 1',
         categoryId: '123e4567-e89b-12d3-a456-426614174000',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const response = await request(app)
         .post('/api/item')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'Item 1',
            description: 'any_item_description',
            categoryId: '123e4567-e89b-12d3-a456-426614174000',
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Item already exists');
   });

   it('should update an item', async () => {
      const item = await ItemModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Item 1',
         userId: '123e4567-e89b-12d3-a456-426614174000',
         description: 'Description 1',
         categoryId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const response = await request(app)
         .put(`/api/item/${item._id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_item_name',
            description: 'any_item_description',
            categoryId: '123e4567-e89b-12d3-a456-426614174000',
         });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Item updated succesfully'
      );
      expect(response.body.data).toHaveProperty('name', 'any_item_name');
      expect(response.body.data).toHaveProperty(
         'description',
         'any_item_description'
      );
      expect(response.body.data).toHaveProperty(
         'categoryId',
         '123e4567-e89b-12d3-a456-426614174000'
      );
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
   });

   it('should return an error when try update a non-existent item', async () => {
      const response = await request(app)
         .put('/api/item/123e4567-e89b-12d3-a456-426614174000')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_item_name',
            description: 'any_item_description',
            categoryId: '123e4567-e89b-12d3-a456-426614174000',
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Item not found');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should return an error when updating an item with invalid data', async () => {
      const item = await ItemModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Item 1',
         description: 'Description 1',
         categoryId: '123e4567-e89b-12d3-a456-426614174000',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const response = await request(app)
         .put(`/api/item/${item.id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Name is required');
      expect(response.body.message).toContain('CategoryId is required');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should get an item', async () => {
      const item = await ItemModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Item 1',
         description: 'Description 1',
         categoryId: '123e4567-e89b-12d3-a456-426614174000',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const response = await request(app)
         .get(`/api/item/${item._id}`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Item founded succesfully'
      );
      expect(response.body.data).toHaveProperty('id', item._id);
      expect(response.body.data).toHaveProperty('name', 'Item 1');
      expect(response.body.data).toHaveProperty('description', 'Description 1');
      expect(response.body.data).toHaveProperty(
         'categoryId',
         '123e4567-e89b-12d3-a456-426614174000'
      );
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
   });

   it('should get all items', async () => {
      const item1 = await ItemModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Item 1',
         description: 'Description 1',
         categoryId: '123e4567-e89b-12d3-a456-426614174000',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const item2 = await ItemModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174001',
         name: 'Item 2',
         description: 'Description 2',
         categoryId: '123e4567-e89b-12d3-a456-426614174000',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const response = await request(app)
         .get('/api/items')
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Items listed succesfully'
      );
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.items[0]).toHaveProperty('id', item1._id);
      expect(response.body.data.items[0]).toHaveProperty('name', item1.name);
      expect(response.body.data.items[0]).toHaveProperty(
         'description',
         item1.description
      );
      expect(response.body.data.items[0]).toHaveProperty(
         'categoryId',
         item1.categoryId
      );
      expect(response.body.data.items[0]).toHaveProperty('createdAt');
      expect(response.body.data.items[0]).toHaveProperty('updatedAt');
      expect(response.body.data.items[1]).toHaveProperty('id', item2._id);
      expect(response.body.data.items[1]).toHaveProperty('name', item2.name);
      expect(response.body.data.items[1]).toHaveProperty(
         'description',
         item2.description
      );
      expect(response.body.data.items[1]).toHaveProperty(
         'categoryId',
         item2.categoryId
      );
      expect(response.body.data.items[1]).toHaveProperty('createdAt');
      expect(response.body.data.items[1]).toHaveProperty('updatedAt');
   });

   it('should delete an item', async () => {
      const item = await ItemModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Item 1',
         description: 'Description 1',
         categoryId: '123e4567-e89b-12d3-a456-426614174000',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const response = await request(app)
         .delete(`/api/item/${item._id}`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
         'message',
         'Item deleted succesfully'
      );
      expect(response.body).not.toHaveProperty('data');
      const itemFound = await ItemModel.findOne({ _id: item._id });
      expect(itemFound).toBeFalsy();
   });

   it('should return an error when try delete a non-existent item', async () => {
      const response = await request(app)
         .delete(`/api/item/123e4567-e89b-12d3-a456-426614174000`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Item not found');
      expect(response.body).not.toHaveProperty('data');
   });

   describe('Schema validation tests', () => {
      describe('POST /api/item - Create Item Schema Validation', () => {
         it('should return validation error when name is missing', async () => {
            const response = await request(app)
               .post('/api/item')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  description: 'any_description',
                  categoryId: '123e4567-e89b-12d3-a456-426614174000',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name is required');
         });

         it('should return validation error when name is empty', async () => {
            const response = await request(app)
               .post('/api/item')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: '',
                  description: 'any_description',
                  categoryId: '123e4567-e89b-12d3-a456-426614174000',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name must be a string');
         });

         it('should return validation error when categoryId is missing', async () => {
            const response = await request(app)
               .post('/api/item')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('CategoryId is required');
         });

         it('should return validation error when categoryId is invalid UUID', async () => {
            const response = await request(app)
               .post('/api/item')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  categoryId: 'invalid-uuid',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain(
               'CategoryId must be a valid UUID'
            );
         });
      });

      describe('PUT /api/item/:id - Update Item Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .put('/api/item/invalid-uuid')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  categoryId: '123e4567-e89b-12d3-a456-426614174000',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });

         it('should return validation error when name is missing in update', async () => {
            const item = await ItemModel.create({
               _id: '123e4567-e89b-12d3-a456-426614174000',
               name: 'Item 1',
               description: 'Description 1',
               categoryId: '123e4567-e89b-12d3-a456-426614174000',
               userId: '123e4567-e89b-12d3-a456-426614174000',
            });
            const response = await request(app)
               .put(`/api/item/${item.id}`)
               .set('Authorization', 'Bearer ' + token)
               .send({
                  description: 'any_description',
                  categoryId: '123e4567-e89b-12d3-a456-426614174000',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name is required');
         });

         it('should return validation error when categoryId is missing in update', async () => {
            const item = await ItemModel.create({
               _id: '123e4567-e89b-12d3-a456-426614174000',
               name: 'Item 1',
               description: 'Description 1',
               categoryId: '123e4567-e89b-12d3-a456-426614174000',
               userId: '123e4567-e89b-12d3-a456-426614174000',
            });
            const response = await request(app)
               .put(`/api/item/${item.id}`)
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('CategoryId is required');
         });
      });

      describe('GET /api/item/:id - Find Item Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .get('/api/item/invalid-uuid')
               .set('Authorization', 'Bearer ' + token);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });
      });

      describe('DELETE /api/item/:id - Delete Item Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .delete('/api/item/invalid-uuid')
               .set('Authorization', 'Bearer ' + token);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });
      });
   });
});
