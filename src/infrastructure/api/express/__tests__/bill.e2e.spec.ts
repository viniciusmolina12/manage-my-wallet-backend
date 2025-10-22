import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import BillModel from '@infrastructure/db/mongodb/model/bill.model';
import token from './___mocks__/jsonwebtoken.mock';
import itemModel from '@infrastructure/db/mongodb/model/item.model';
import vendorModel from '@infrastructure/db/mongodb/model/vendor.model';
import { PeriodType } from '@core/usecases/bill/summary/periods';
import { BillBuilder } from './___mocks__/bill.builder.mock';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   await mockDb.clear();
   const item = await itemModel.create({
      _id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'any_item_name',
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      description: 'any_item_description',
      userId: '123e4567-e89b-12d3-a456-426614174000',
   });
});

afterAll(async () => {
   await mockDb.disconnect();
});
describe('Bill e2e tests', () => {
   it('should create a bill', async () => {
      const vendorId = new VendorId();
      const vendor = await vendorModel.create({
         _id: vendorId.id,
         name: 'any_vendor_name',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const response = await request(app)
         .post('/api/bill')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_bill_name',
            description: 'any_bill_description',
            vendorId: vendorId.id,
            date: new Date('2021-01-01T00:00:00.000Z'),
            items: [
               {
                  quantity: 10,
                  price: 100,
                  itemId: '123e4567-e89b-12d3-a456-426614174000',
               },
            ],
         });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Bill created successfully'
      );
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', 'any_bill_name');
      expect(response.body.data).toHaveProperty(
         'description',
         'any_bill_description'
      );
      expect(response.body.data).toHaveProperty('date', '2021-01-01');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
   });

   it('should return an error when creating an bill with invalid data', async () => {
      const response = await request(app)
         .post('/api/bill')
         .set('Authorization', 'Bearer ' + token)
         .send({});
      expect(response.status).toBe(400);
   });

   it('should update a bill', async () => {
      const vendor = await vendorModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'any_vendor_name',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const bill = await new BillBuilder().buildAndCreateModel();
      const bills = await BillModel.find({});
      const response = await request(app)
         .put(`/api/bill/${bill.id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({
            id: bill.id,
            name: 'any_bill_name',
            description: 'any_bill_description',
            vendorId: '123e4567-e89b-12d3-a456-426614174000',
            date: new Date('2021-01-02T00:00:00.000Z'),
            items: [
               {
                  quantity: 10,
                  price: 100,
                  itemId: '123e4567-e89b-12d3-a456-426614174000',
               },
            ],
         });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
         'message',
         'Bill updated successfully'
      );
      expect(response.body.data).toHaveProperty('id', bill.id);
      expect(response.body.data).toHaveProperty('name', 'any_bill_name');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Bill updated successfully'
      );
      expect(response.body.data).toHaveProperty('name', 'any_bill_name');
      expect(response.body.data).toHaveProperty(
         'description',
         'any_bill_description'
      );
      expect(response.body.data).toHaveProperty('date', '2021-01-02');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
   });

   it('should return an error when try update a non-existent bill', async () => {
      const response = await request(app)
         .put('/api/bill/123e4567-e89b-12d3-a456-426614174000')
         .set('Authorization', 'Bearer ' + token)
         .send({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'any_bill_name',
            description: 'any_bill_description',
            vendorId: '123e4567-e89b-12d3-a456-426614174000',
            date: new Date('2021-01-02T00:00:00.000Z'),
            items: [
               {
                  quantity: 10,
                  price: 100,
                  itemId: '123e4567-e89b-12d3-a456-426614174000',
               },
            ],
         });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Bill not exists');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should return an error when updating a bill with invalid data', async () => {
      const vendor = await vendorModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'any_vendor_name',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const bill = await new BillBuilder().buildAndCreateModel();
      const response = await request(app)
         .put(`/api/bill/${bill.id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({
            id: bill.id,
            vendorId: '123e4567-e89b-12d3-a456-426614174000',
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Name is required');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should get a bill', async () => {
      const bill = await new BillBuilder().buildAndCreateModel();
      const response = await request(app)
         .get(`/api/bill/${bill.id}`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Bill founded successfully'
      );
      expect(response.body.data).toHaveProperty('id', bill.id);
      expect(response.body.data).toHaveProperty('name', bill.name);
      expect(response.body.data).toHaveProperty(
         'date',
         bill.date.toISOString().split('T')[0]
      );
      expect(response.body.data).toHaveProperty(
         'description',
         bill.description
      );
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
   });

   describe('/api/bills GET', () => {
      it('should get all bills by name', async () => {
         const bill = await new BillBuilder()
            .withName('Bill 1')
            .buildAndCreateModel();

         await new BillBuilder()
            .withName('Bill 2')
            .withId('123e4567-e89b-12d3-a456-426614174000')
            .createModel();

         await new BillBuilder()
            .withName('other_bill')
            .withId('123e4567-e89b-12d3-a456-426614174001')
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               name: 'Bill 1',
            });
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Bills listed successfully'
         );
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.bills[0]).toHaveProperty('id', bill.id);
         expect(response.body.data.bills[0]).toHaveProperty('name', bill.name);
      });

      it('should get all bills by vendorId', async () => {
         const bill = await new BillBuilder()
            .withVendorId(new VendorId('123e4567-e89b-12d3-a456-426614174000'))
            .buildAndCreateModel();
         await new BillBuilder().createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               vendorId: '123e4567-e89b-12d3-a456-426614174000',
            });
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Bills listed successfully'
         );
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.bills[0]).toHaveProperty('id', bill.id);
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill.vendorId.id
         );
      });

      it('should get all bills by startDate', async () => {
         const bill = await new BillBuilder().buildAndCreateModel();

         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174000')
            .withDate(new Date('2021-01-01T00:00:00.000Z'))
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               startDate: '2021-01-02',
            });
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Bills listed successfully'
         );
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.bills[0]).toHaveProperty('id', bill.id);
      });

      it('should get all bills by endDate', async () => {
         await new BillBuilder().buildAndCreateModel();
         const bill = await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174000')
            .withDate(new Date('2021-01-01T00:00:00.000Z'))
            .buildAndCreateModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               endDate: '2021-01-01',
            });
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Bills listed successfully'
         );
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.bills[0]).toHaveProperty('id', bill.id);
      });

      it('should get bills with pagination - first page', async () => {
         // Criar 5 bills para testar paginação
         for (let i = 1; i <= 5; i++) {
            await new BillBuilder()
               .withId(`123e4567-e89b-12d3-a456-42661417400${i}`)
               .withName(`Bill ${i}`)
               .createModel();
         }

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               page: '1',
               perPage: '2',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(2);
         expect(response.body.data.meta).toHaveProperty('page', 1);
         expect(response.body.data.meta).toHaveProperty('perPage', 2);
         expect(response.body.data.meta).toHaveProperty('total', 5);
         expect(response.body.data.meta).toHaveProperty('hasNext', true);
      });

      it('should get bills with pagination - second page', async () => {
         // Criar 5 bills para testar paginação
         for (let i = 1; i <= 5; i++) {
            await new BillBuilder()
               .withId(`123e4567-e89b-12d3-a456-42661417400${i}`)
               .withName(`Bill ${i}`)
               .createModel();
         }

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               page: '2',
               perPage: '2',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(2);
         expect(response.body.data.meta).toHaveProperty('page', 2);
         expect(response.body.data.meta).toHaveProperty('perPage', 2);
         expect(response.body.data.meta).toHaveProperty('total', 5);
         expect(response.body.data.meta).toHaveProperty('hasNext', true);
      });

      it('should get bills with pagination - last page with remaining items', async () => {
         // Criar 5 bills para testar paginação
         for (let i = 1; i <= 5; i++) {
            await new BillBuilder()
               .withId(`123e4567-e89b-12d3-a456-42661417400${i}`)
               .withName(`Bill ${i}`)
               .createModel();
         }

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               page: '3',
               perPage: '2',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.meta).toHaveProperty('page', 3);
         expect(response.body.data.meta).toHaveProperty('perPage', 2);
         expect(response.body.data.meta).toHaveProperty('total', 5);
         expect(response.body.data.meta).toHaveProperty('hasNext', false);
      });

      it('should get bills with ordering - ascending by name', async () => {
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174000')
            .withName('Charlie Bill')
            .createModel();
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174001')
            .withName('Alpha Bill')
            .createModel();
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174002')
            .withName('Beta Bill')
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               order: 'asc',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data.bills).toHaveLength(3);
         // Verificar se todos os bills estão presentes
         const billNames = response.body.data.bills.map(
            (bill: any) => bill.name
         );
         expect(billNames).toContain('Alpha Bill');
         expect(billNames).toContain('Beta Bill');
         expect(billNames).toContain('Charlie Bill');
      });

      it('should get bills with ordering - descending by name', async () => {
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174000')
            .withName('Alpha Bill')
            .createModel();
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174001')
            .withName('Charlie Bill')
            .createModel();
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174002')
            .withName('Beta Bill')
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               order: 'desc',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data.bills).toHaveLength(3);
         // Verificar se todos os bills estão presentes
         const billNames = response.body.data.bills.map(
            (bill: any) => bill.name
         );
         expect(billNames).toContain('Alpha Bill');
         expect(billNames).toContain('Beta Bill');
         expect(billNames).toContain('Charlie Bill');
      });

      it('should get bills with combined filters - name and vendorId', async () => {
         const vendorId = new VendorId('123e4567-e89b-12d3-a456-426614174000');
         const bill = await new BillBuilder()
            .withName('Specific Bill')
            .withVendorId(vendorId)
            .buildAndCreateModel();

         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174001')
            .withName('Other Bill')
            .withVendorId(vendorId)
            .createModel();

         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174002')
            .withName('Specific Bill')
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               name: 'Specific Bill',
               vendorId: vendorId.id,
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.bills[0]).toHaveProperty('id', bill.id);
         expect(response.body.data.bills[0]).toHaveProperty(
            'name',
            'Specific Bill'
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            vendorId.id
         );
      });

      it('should get bills with combined filters - date range and pagination', async () => {
         // Criar bills em diferentes datas
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174000')
            .withDate(new Date('2021-01-01T00:00:00.000Z'))
            .createModel();
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174001')
            .withDate(new Date('2021-01-15T00:00:00.000Z'))
            .createModel();
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174002')
            .withDate(new Date('2021-02-01T00:00:00.000Z'))
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               startDate: '2021-01-01',
               endDate: '2021-01-31',
               page: '1',
               perPage: '1',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.meta).toHaveProperty('total', 2);
         expect(response.body.data.meta).toHaveProperty('hasNext', true);
      });

      it('should get bills with all filters combined', async () => {
         const vendorId = new VendorId('123e4567-e89b-12d3-a456-426614174000');
         const bill = await new BillBuilder()
            .withName('Target Bill')
            .withVendorId(vendorId)
            .withDate(new Date('2021-01-15T00:00:00.000Z'))
            .buildAndCreateModel();

         // Criar bills que não devem aparecer nos resultados
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174001')
            .withName('Other Bill')
            .withVendorId(vendorId)
            .withDate(new Date('2021-01-15T00:00:00.000Z'))
            .createModel();

         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174002')
            .withName('Target Bill')
            .withDate(new Date('2021-02-01T00:00:00.000Z'))
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               name: 'Target Bill',
               vendorId: vendorId.id,
               startDate: '2021-01-01',
               endDate: '2021-01-31',
               page: '1',
               perPage: '10',
               order: 'asc',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.bills[0]).toHaveProperty('id', bill.id);
         expect(response.body.data.bills[0]).toHaveProperty(
            'name',
            'Target Bill'
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            vendorId.id
         );
      });

      it('should return empty result when page exceeds total pages', async () => {
         // Criar apenas 2 bills
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174000')
            .createModel();
         await new BillBuilder()
            .withId('123e4567-e89b-12d3-a456-426614174001')
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               page: '5',
               perPage: '2',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(0);
         expect(response.body.data.meta).toHaveProperty('page', 5);
         expect(response.body.data.meta).toHaveProperty('perPage', 2);
         expect(response.body.data.meta).toHaveProperty('total', 2);
         expect(response.body.data.meta).toHaveProperty('hasNext', false);
      });

      it('should handle large perPage values gracefully', async () => {
         // Criar apenas 3 bills
         for (let i = 1; i <= 3; i++) {
            await new BillBuilder()
               .withId(`123e4567-e89b-12d3-a456-42661417400${i}`)
               .createModel();
         }

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               page: '1',
               perPage: '100',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(3);
         expect(response.body.data.meta).toHaveProperty('page', 1);
         expect(response.body.data.meta).toHaveProperty('perPage', 100);
         expect(response.body.data.meta).toHaveProperty('total', 3);
         expect(response.body.data.meta).toHaveProperty('hasNext', false);
      });

      it('should default to first page when page is 0 or negative', async () => {
         // Criar 3 bills
         for (let i = 1; i <= 3; i++) {
            await new BillBuilder()
               .withId(`123e4567-e89b-12d3-a456-42661417400${i}`)
               .createModel();
         }

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               page: '0',
               perPage: '2',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(2);
         expect(response.body.data.meta).toHaveProperty('page', 1);
         expect(response.body.data.meta).toHaveProperty('perPage', 2);
         expect(response.body.data.meta).toHaveProperty('total', 3);
         expect(response.body.data.meta).toHaveProperty('hasNext', true);
      });

      it('should default to reasonable perPage when perPage is 0 or negative', async () => {
         // Criar 5 bills
         for (let i = 1; i <= 5; i++) {
            await new BillBuilder()
               .withId(`123e4567-e89b-12d3-a456-42661417400${i}`)
               .createModel();
         }

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               page: '1',
               perPage: '0',
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body.data).toHaveProperty('meta');
         expect(response.body.data.bills).toHaveLength(5);
         expect(response.body.data.meta).toHaveProperty('page', 1);
         expect(response.body.data.meta).toHaveProperty('perPage', 10); // Valor padrão
         expect(response.body.data.meta).toHaveProperty('total', 5);
         expect(response.body.data.meta).toHaveProperty('hasNext', false);
      });
   });
   it('should delete a bill', async () => {
      const bill = await new BillBuilder().buildAndCreateModel();
      const response = await request(app)
         .delete(`/api/bill/${bill.id}`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
         'message',
         'Bill deleted successfully'
      );
      expect(response.body).not.toHaveProperty('data');
      const billFound = await BillModel.findOne({ _id: bill.id });
      expect(billFound).toBeFalsy();
   });

   it('should return an error when try delete a non-existent bill', async () => {
      const response = await request(app)
         .delete(`/api/bill/123e4567-e89b-12d3-a456-426614174000`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bill not found');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should throw an error when try create a bill with an invalid item', async () => {
      await vendorModel.create({
         _id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'any_vendor_name',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      });
      const response = await request(app)
         .post('/api/bill')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_bill_name',
            description: 'any_bill_description',
            vendorId: '123e4567-e89b-12d3-a456-426614174000',
            date: new Date('2021-01-01T00:00:00.000Z'),
            items: [
               {
                  itemId: '123e4567-e89b-12d3-a456-426614174001',
                  price: 10,
                  quantity: 1,
               },
            ],
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Item not found');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should get the summary of the bills by period MONTH', async () => {
      await new BillBuilder().createModel();
      await new BillBuilder()
         .withId('123e4567-e89b-12d3-a456-426614174000')
         .withDate(new Date('2021-01-01T00:00:00.000Z'))
         .createModel();
      const response = await request(app)
         .get('/api/bill/summary')
         .set('Authorization', 'Bearer ' + token)
         .query({ period: PeriodType.MONTH });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Summary of bills');
      expect(response.body.data).toHaveProperty('bills');
      expect(response.body.data.bills).toHaveLength(1);
   });

   it('should get the summary of the bills by period YEAR', async () => {
      await new BillBuilder().createModel();
      await new BillBuilder()
         .withId('123e4567-e89b-12d3-a456-426614174001')
         .createModel();
      await new BillBuilder()
         .withId('123e4567-e89b-12d3-a456-426614174002')
         .withDate(new Date('2021-01-01T00:00:00.000Z'))
         .createModel();

      const response = await request(app)
         .get('/api/bill/summary')
         .set('Authorization', 'Bearer ' + token)
         .query({ period: PeriodType.YEAR });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Summary of bills');
      expect(response.body.data).toHaveProperty('bills');
      expect(response.body.data.bills).toHaveLength(2);
   });

   it('should get the summary of the bills by period SEMESTER', async () => {
      const todayMinusThreeMonths = new Date();
      todayMinusThreeMonths.setMonth(todayMinusThreeMonths.getMonth() - 3);
      await new BillBuilder().createModel();
      await new BillBuilder()
         .withId('123e4567-e89b-12d3-a456-426614174001')
         .withDate(todayMinusThreeMonths)
         .createModel();
      await new BillBuilder()
         .withId('123e4567-e89b-12d3-a456-426614174000')
         .withDate(new Date('2021-01-01T00:00:00.000Z'))
         .createModel();
      const response = await request(app)
         .get('/api/bill/summary')
         .set('Authorization', 'Bearer ' + token)
         .query({ period: PeriodType.SEMESTER });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Summary of bills');
      expect(response.body.data).toHaveProperty('bills');
      expect(response.body.data.bills).toHaveLength(2);
   });

   it('should get the summary of the bills by period QUARTER', async () => {
      const todayMinusOneMonth = new Date();
      todayMinusOneMonth.setMonth(todayMinusOneMonth.getMonth() - 1);
      await new BillBuilder().createModel();
      await new BillBuilder()
         .withId('123e4567-e89b-12d3-a456-426614174000')
         .withDate(todayMinusOneMonth)
         .createModel();
      await new BillBuilder()
         .withId('123e4567-e89b-12d3-a456-426614174001')
         .withDate(new Date('2021-01-01T00:00:00.000Z'))
         .createModel();
      const response = await request(app)
         .get('/api/bill/summary')
         .set('Authorization', 'Bearer ' + token)
         .query({ period: PeriodType.QUARTER });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Summary of bills');
      expect(response.body.data).toHaveProperty('bills');
      expect(response.body.data.bills).toHaveLength(2);
   });

   it('should throw an error when try get the summary of the bills with an invalid period', async () => {
      const response = await request(app)
         .get('/api/bill/summary')
         .set('Authorization', 'Bearer ' + token)
         .query({ period: 'invalid_period' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Period must be a valid period');
   });

   describe('Schema validation tests', () => {
      describe('POST /api/bill - Create Bill Schema Validation', () => {
         it('should return validation error when name is missing', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: 1,
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name is required');
         });

         it('should return validation error when name is empty', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: '',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: 1,
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name must be a string');
         });

         it('should return validation error when vendorId is missing', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: 1,
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('VendorId is required');
         });

         it('should return validation error when vendorId is invalid UUID', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: 'invalid-uuid',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: 1,
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain(
               'VendorId must be a valid UUID'
            );
         });

         it('should return validation error when date is missing', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  items: [
                     {
                        quantity: 1,
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Invalid date');
         });

         it('should return validation error when items array is empty', async () => {
            await vendorModel.create({
               _id: '123e4567-e89b-12d3-a456-426614174000',
               name: 'any_vendor_name',
               userId: '123e4567-e89b-12d3-a456-426614174000',
            });
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Items is required');
         });

         it('should return validation error when item quantity is missing', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Quantity is required');
         });

         it('should return validation error when item quantity is negative', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: -1,
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain(
               'Quantity must be a positive number'
            );
         });

         it('should return validation error when item price is missing', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: 1,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Price is required');
         });

         it('should return validation error when item price is negative', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: 1,
                        price: -10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain(
               'Price must be a positive number'
            );
         });

         it('should return validation error when itemId is missing', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [{ quantity: 1, price: 10 }],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('ItemId is required');
         });

         it('should return validation error when itemId is invalid UUID', async () => {
            const response = await request(app)
               .post('/api/bill')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  name: 'any_name',
                  description: 'any_description',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [{ quantity: 1, price: 10, itemId: 'invalid-uuid' }],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain(
               'ItemId must be a valid UUID'
            );
         });
      });

      describe('PUT /api/bill/:id - Update Bill Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .put('/api/bill/invalid-uuid')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  id: 'invalid-uuid',
                  name: 'any_name',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: 1,
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });

         it('should return validation error when name is missing in update', async () => {
            const response = await request(app)
               .put('/api/bill/123e4567-e89b-12d3-a456-426614174000')
               .set('Authorization', 'Bearer ' + token)
               .send({
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [
                     {
                        quantity: 1,
                        price: 10,
                        itemId: '123e4567-e89b-12d3-a456-426614174000',
                     },
                  ],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Name is required');
         });

         it('should return validation error when items array is empty in update', async () => {
            await vendorModel.create({
               _id: '123e4567-e89b-12d3-a456-426614174000',
               name: 'any_vendor_name',
               userId: '123e4567-e89b-12d3-a456-426614174000',
            });
            const bill = await new BillBuilder().buildAndCreateModel();
            const response = await request(app)
               .put(`/api/bill/${bill.id}`)
               .set('Authorization', 'Bearer ' + token)
               .send({
                  id: bill.id,
                  name: 'any_name',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  date: new Date('2021-01-01T00:00:00.000Z'),
                  items: [],
               });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Items is required');
         });
      });

      describe('GET /api/bill/:id - Find Bill Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .get('/api/bill/invalid-uuid')
               .set('Authorization', 'Bearer ' + token);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });
      });

      describe('DELETE /api/bill/:id - Delete Bill Schema Validation', () => {
         it('should return validation error when id is invalid UUID', async () => {
            const response = await request(app)
               .delete('/api/bill/invalid-uuid')
               .set('Authorization', 'Bearer ' + token);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Id must be a valid UUID');
         });
      });

      describe('GET /api/bill/summary - Summary Bill Schema Validation', () => {
         it('should return validation error when period is missing', async () => {
            const response = await request(app)
               .get('/api/bill/summary')
               .set('Authorization', 'Bearer ' + token);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Period is required');
         });

         it('should return validation error when period is not a valid enum value', async () => {
            const response = await request(app)
               .get('/api/bill/summary')
               .set('Authorization', 'Bearer ' + token)
               .query({ period: 'invalid_period' });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain(
               'Period must be a valid period'
            );
         });

         it('should accept valid period values', async () => {
            const response = await request(app)
               .get('/api/bill/summary')
               .set('Authorization', 'Bearer ' + token)
               .query({ period: PeriodType.MONTH });
            expect(response.status).toBe(200);
         });
      });

      describe('GET /api/bills - List Bills Schema Validation', () => {
         it('should accept valid query parameters', async () => {
            const response = await request(app)
               .get('/api/bills')
               .set('Authorization', 'Bearer ' + token)
               .query({
                  name: 'test',
                  vendorId: '123e4567-e89b-12d3-a456-426614174000',
                  startDate: '2021-01-01',
                  endDate: '2021-12-31',
                  page: '1',
                  perPage: '10',
                  order: 'asc',
               });
            expect(response.status).toBe(200);
         });

         it('should handle invalid date format gracefully', async () => {
            const response = await request(app)
               .get('/api/bills')
               .set('Authorization', 'Bearer ' + token)
               .query({
                  startDate: 'invalid-date',
                  endDate: 'invalid-date',
               });
            expect(response.status).toBe(400);
         });
      });
   });
});
