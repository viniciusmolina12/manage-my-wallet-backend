import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import CategoryModel from '@infrastructure/db/mongodb/model/category.model';
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
describe('Category e2e tests', () => {
   it('should create an category', async () => {
      const response = await request(app)
         .post('/api/category')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_category_name',
            description: 'any_category_description',
         });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Category created successfully'
      );
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', 'any_category_name');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
      expect(response.body.data).toHaveProperty(
         'description',
         'any_category_description'
      );
   });

   it('should return an error when creating a category with invalid data', async () => {
      const response = await request(app)
         .post('/api/category')
         .set('Authorization', 'Bearer ' + token)
         .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
         'message',
         'category: Name is required, '
      );
   });

   it('should update an category', async () => {
      const category = await CategoryModel.create({
         _id: 'any_hash_id',
         name: 'Category 1',
         description: 'Description 1',
         userId: 'any_user_id',
      });
      const response = await request(app)
         .put(`/api/category/${category._id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_category_name',
            description: 'any_category_description',
         });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Category updated succesfully'
      );
      expect(response.body.data).toHaveProperty('name', 'any_category_name');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
      expect(response.body.data).toHaveProperty(
         'description',
         'any_category_description'
      );
   });

   it('should return an error when try update a non-existent category', async () => {
      const response = await request(app)
         .put('/api/category/any_hash_id')
         .set('Authorization', 'Bearer ' + token)
         .send({ name: 'other_hash_id' });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Category not found');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should return an error when updating an category with invalid data', async () => {
      const category = await CategoryModel.create({
         _id: 'any_hash_id',
         name: 'Category 1',
         userId: 'any_user_id',
         description: 'Description 1',
      });
      const response = await request(app)
         .put(`/api/category/${category.id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
         'message',
         'category: Name is required, '
      );
      expect(response.body).not.toHaveProperty('data');
   });

   it('should get a category', async () => {
      const category = await CategoryModel.create({
         _id: 'any_hash_id',
         name: 'Category 1',
         description: 'Description 1',
         userId: 'any_user_id',
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      const response = await request(app)
         .get(`/api/category/${category._id}`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Category founded succesfully'
      );
      expect(response.body.data).toHaveProperty('id', category._id);
      expect(response.body.data).toHaveProperty('name', 'Category 1');
      expect(response.body.data).toHaveProperty('description', 'Description 1');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
   });

   it('should get all categories', async () => {
      const category1 = await CategoryModel.create({
         _id: 'any_hash_id',
         name: 'Category 1',
         description: 'Description 1',
         userId: 'any_user_id',
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      const category2 = await CategoryModel.create({
         _id: 'any_hash_id_2',
         name: 'Category 2',
         description: 'Description 2',
         userId: 'any_user_id',
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      const response = await request(app)
         .get('/api/categories')
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Categories listed succesfully'
      );
      expect(response.body.data.categories).toHaveLength(2);
      expect(response.body.data.categories[0]).toHaveProperty(
         'id',
         category1._id
      );
      expect(response.body.data.categories[0]).toHaveProperty(
         'name',
         category1.name
      );
      expect(response.body.data.categories[0]).toHaveProperty(
         'description',
         category1.description
      );
      expect(response.body.data.categories[0]).toHaveProperty('createdAt');
      expect(response.body.data.categories[0]).toHaveProperty('updatedAt');
      expect(response.body.data.categories[1]).toHaveProperty(
         'id',
         category2._id
      );
      expect(response.body.data.categories[1]).toHaveProperty(
         'name',
         category2.name
      );
      expect(response.body.data.categories[1]).toHaveProperty(
         'description',
         category2.description
      );
      expect(response.body.data.categories[1]).toHaveProperty('createdAt');
      expect(response.body.data.categories[1]).toHaveProperty('updatedAt');
   });

   it('should delete a category', async () => {
      const category = await CategoryModel.create({
         _id: 'any_hash_id',
         name: 'Category 1',
         description: 'Description 1',
         userId: 'any_user_id',
      });
      const response = await request(app)
         .delete(`/api/category/${category._id}`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
         'message',
         'Category deleted succesfully'
      );
      expect(response.body).not.toHaveProperty('data');
      const categoryFound = await CategoryModel.findOne({
         _id: category._id,
      });
      expect(categoryFound).toBeFalsy();
   });

   it('should return an error when try delete a non-existent category', async () => {
      const response = await request(app)
         .delete(`/api/category/non-existent-id`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Category not found');
      expect(response.body).not.toHaveProperty('data');
   });
});
