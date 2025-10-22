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
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Name is required');
   });

   it('should update an category', async () => {
      const category = await CategoryModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Category 1',
         description: 'Description 1',
         userId: '123e4567-e89b-12d3-a456-426614174000',
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
         .put('/api/category/123e4567-e89b-12d3-a456-426614174000')
         .set('Authorization', 'Bearer ' + token)
         .send({ name: 'other_hash_id' });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Category not found');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should return an error when updating an category with invalid data', async () => {
      const category = await CategoryModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Category 1',
         userId: '123e4567-e89b-12d3-a456-426614174000',
         description: 'Description 1',
      });
      const response = await request(app)
         .put(`/api/category/${category.id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Name is required');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should get a category', async () => {
      const category = await CategoryModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Category 1',
         description: 'Description 1',
         userId: '123e4567-e89b-12d3-a456-426614174000',
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
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Category 1',
         description: 'Description 1',
         userId: '123e4567-e89b-12d3-a456-426614174000',
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      const category2 = await CategoryModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174001',
         name: 'Category 2',
         description: 'Description 2',
         userId: '123e4567-e89b-12d3-a456-426614174000',
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
      expect(response.body.data.categories).toEqual(
         expect.arrayContaining([
            expect.objectContaining({
               id: category1._id,
               name: category1.name,
               description: category1.description,
               createdAt: expect.any(String),
               updatedAt: expect.any(String),
            }),
            expect.objectContaining({
               id: category2._id,
               name: category2.name,
               description: category2.description,
               createdAt: expect.any(String),
               updatedAt: expect.any(String),
            }),
         ])
      );
   });

   it('should delete a category', async () => {
      const category = await CategoryModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'Category 1',
         description: 'Description 1',
         userId: '123e4567-e89b-12d3-a456-426614174000',
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
         .delete(`/api/category/123e4567-e89b-12d3-a456-426614174000`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Category not found');
      expect(response.body).not.toHaveProperty('data');
   });

   describe('List filters tests', () => {
      it('should filter categories by name', async () => {
         // Criar categorias com nomes diferentes
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Categoria Alimentação',
            description: 'Categoria para alimentação',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Categoria Transporte',
            description: 'Categoria para transporte',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Alimentação Saudável',
            description: 'Categoria para alimentação saudável',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });

         const response = await request(app)
            .get('/api/categories')
            .query({ name: 'Alimentação' })
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Categories listed succesfully'
         );
         expect(response.body.data.categories).toHaveLength(2);
         expect(response.body.data.categories).toEqual(
            expect.arrayContaining([
               expect.objectContaining({
                  name: 'Categoria Alimentação',
               }),
               expect.objectContaining({
                  name: 'Alimentação Saudável',
               }),
            ])
         );
      });

      it('should return empty list when no categories match name filter', async () => {
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Categoria Alimentação',
            description: 'Categoria para alimentação',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });

         const response = await request(app)
            .get('/api/categories')
            .query({ name: 'Inexistente' })
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(200);
         expect(response.body.data.categories).toHaveLength(0);
         expect(response.body.data.meta.total).toBe(0);
      });

      it('should paginate categories correctly', async () => {
         for (let i = 1; i <= 5; i++) {
            await CategoryModel.create({
               _id: `123e4567-e89b-12d3-a456-42661417400${i}`,
               name: `Categoria ${i}`,
               description: `Descrição ${i}`,
               userId: '123e4567-e89b-12d3-a456-426614174000',
               createdAt: new Date(),
               updatedAt: new Date(),
            });
         }

         const responsePage1 = await request(app)
            .get('/api/categories')
            .query({ page: 1, perPage: 2 })
            .set('Authorization', 'Bearer ' + token);

         expect(responsePage1.status).toBe(200);
         expect(responsePage1.body.data.categories).toHaveLength(2);
         expect(responsePage1.body.data.meta.page).toBe(1);
         expect(responsePage1.body.data.meta.perPage).toBe(2);
         expect(responsePage1.body.data.meta.total).toBe(5);
         expect(responsePage1.body.data.meta.hasNext).toBe(true);

         // Testar segunda página
         const responsePage2 = await request(app)
            .get('/api/categories')
            .query({ page: 2, perPage: 2 })
            .set('Authorization', 'Bearer ' + token);

         expect(responsePage2.status).toBe(200);
         expect(responsePage2.body.data.categories).toHaveLength(2);
         expect(responsePage2.body.data.meta.page).toBe(2);
         expect(responsePage2.body.data.meta.hasNext).toBe(true);

         // Testar terceira página (última)
         const responsePage3 = await request(app)
            .get('/api/categories')
            .query({ page: 3, perPage: 2 })
            .set('Authorization', 'Bearer ' + token);

         expect(responsePage3.status).toBe(200);
         expect(responsePage3.body.data.categories).toHaveLength(1);
         expect(responsePage3.body.data.meta.page).toBe(3);
         expect(responsePage3.body.data.meta.hasNext).toBe(false);
      });

      it('should use default pagination values when not provided', async () => {
         // Criar algumas categorias
         for (let i = 1; i <= 3; i++) {
            await CategoryModel.create({
               _id: `123e4567-e89b-12d3-a456-42661417400${i}`,
               name: `Categoria ${i}`,
               description: `Descrição ${i}`,
               userId: '123e4567-e89b-12d3-a456-426614174000',
               createdAt: new Date(),
               updatedAt: new Date(),
            });
         }

         const response = await request(app)
            .get('/api/categories')
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(200);
         expect(response.body.data.meta.page).toBe(1);
         expect(response.body.data.meta.perPage).toBe(10);
      });

      it('should order categories by name ascending', async () => {
         // Criar categorias com nomes em ordem específica
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Zebra',
            description: 'Categoria Z',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Alface',
            description: 'Categoria A',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Banana',
            description: 'Categoria B',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });

         const response = await request(app)
            .get('/api/categories')
            .query({ order: 'asc' })
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(200);
         expect(response.body.data.categories).toHaveLength(3);
         expect(response.body.data.categories[0].name).toBe('Alface');
         expect(response.body.data.categories[1].name).toBe('Banana');
         expect(response.body.data.categories[2].name).toBe('Zebra');
      });

      it('should order categories by name descending', async () => {
         // Criar categorias com nomes em ordem específica
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Alface',
            description: 'Categoria A',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Banana',
            description: 'Categoria B',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Zebra',
            description: 'Categoria Z',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });

         const response = await request(app)
            .get('/api/categories')
            .query({ order: 'desc' })
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(200);
         expect(response.body.data.categories).toHaveLength(3);
         expect(response.body.data.categories[0].name).toBe('Zebra');
         expect(response.body.data.categories[1].name).toBe('Banana');
         expect(response.body.data.categories[2].name).toBe('Alface');
      });

      it('should combine filters correctly', async () => {
         // Criar categorias para testar combinação de filtros
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Alimentação A',
            description: 'Primeira categoria de alimentação',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Alimentação B',
            description: 'Segunda categoria de alimentação',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });
         await CategoryModel.create({
            _id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Transporte A',
            description: 'Primeira categoria de transporte',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date(),
            updatedAt: new Date(),
         });

         const response = await request(app)
            .get('/api/categories')
            .query({
               name: 'Alimentação',
               page: 1,
               perPage: 1,
               order: 'asc',
            })
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(200);
         expect(response.body.data.categories).toHaveLength(1);
         expect(response.body.data.categories[0].name).toBe('Alimentação A');
         expect(response.body.data.meta.total).toBe(2);
         expect(response.body.data.meta.hasNext).toBe(true);
      });

      it('should return validation error for invalid page parameter', async () => {
         const response = await request(app)
            .get('/api/categories')
            .query({ page: 'invalid' })
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty('message');
         expect(response.body.message).toContain('Page must be a number');
      });

      it('should return validation error for invalid perPage parameter', async () => {
         const response = await request(app)
            .get('/api/categories')
            .query({ perPage: 'invalid' })
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty('message');
         expect(response.body.message).toContain('Per page must be a number');
      });

      it('should return validation error for invalid order parameter', async () => {
         const response = await request(app)
            .get('/api/categories')
            .query({ order: 'invalid_order' })
            .set('Authorization', 'Bearer ' + token);

         expect(response.status).toBe(400);
         expect(response.body).toHaveProperty('message');
         expect(response.body.message).toContain(
            'Order must be a valid string'
         );
      });
   });

   describe('Schema validation tests', () => {
      describe('POST /api/category - Create Category Schema Validation', () => {
         it('should return validation error when name is missing', async () => {
            const response = await request(app)
               .post('/api/category')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  description: 'any_description',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name is required');
         });

         it('should return validation error when name is empty', async () => {
            const response = await request(app)
               .post('/api/category')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: '',
                  description: 'any_description',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name must be a string');
         });
      });

      describe('PUT /api/category/:id - Update Category Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .put('/api/category/invalid-uuid')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });

         it('should return validation error when name is missing in update', async () => {
            const category = await CategoryModel.create({
               _id: '123e4567-e89b-12d3-a456-426614174000',
               name: 'Category 1',
               userId: '123e4567-e89b-12d3-a456-426614174000',
               description: 'Description 1',
            });
            const response = await request(app)
               .put(`/api/category/${category.id}`)
               .set('Authorization', 'Bearer ' + token)
               .send({
                  description: 'any_description',
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name is required');
         });
      });

      describe('GET /api/category/:id - Find Category Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .get('/api/category/invalid-uuid')
               .set('Authorization', 'Bearer ' + token);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });
      });

      describe('DELETE /api/category/:id - Delete Category Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .delete('/api/category/invalid-uuid')
               .set('Authorization', 'Bearer ' + token);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });
      });
   });
});
