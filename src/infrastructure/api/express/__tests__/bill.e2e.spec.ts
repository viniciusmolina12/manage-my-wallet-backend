import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import BillModel from '@infrastructure/db/mongodb/model/bill.model';
import token from './___mocks__/jsonwebtoken.mock';
import itemModel from '@infrastructure/db/mongodb/model/item.model';
import vendorModel from '@infrastructure/db/mongodb/model/vendor.model';
import { PeriodType } from '@core/usecases/bill/summary/periods';
import { BillBuilder } from './___mocks__/bill.builder.mock.';

beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   await mockDb.clear();
   const item = await itemModel.create({
      _id: 'any_item_id',
      name: 'any_item_name',
      categoryId: 'any_category_id',
      description: 'any_item_description',
      userId: 'any_user_id',
   });
});

afterAll(async () => {
   await mockDb.disconnect();
});
describe('Bill e2e tests', () => {
   it('should create a bill', async () => {
      const vendor = await vendorModel.create({
         _id: 'any_vendor_id',
         name: 'any_vendor_name',
         userId: 'any_user_id',
      });
      const response = await request(app)
         .post('/api/bill')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_bill_name',
            description: 'any_bill_description',
            vendorId: 'any_vendor_id',
            date: new Date('2021-01-01T00:00:00.000Z'),
            items: [
               {
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
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
         _id: 'any_other_vendor_id',
         name: 'any_vendor_name',
         userId: 'any_user_id',
      });
      const bill = await new BillBuilder().buildAndCreateModel();
      const response = await request(app)
         .put(`/api/bill/${bill.id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({
            id: 'any_hash_id',
            name: 'any_bill_name',
            description: 'any_bill_description',
            vendorId: 'any_other_vendor_id',
            date: new Date('2021-01-02T00:00:00.000Z'),
            items: [
               {
                  id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
      expect(response.status).toBe(200);
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
         .put('/api/bill/any_hash_id')
         .set('Authorization', 'Bearer ' + token)
         .send({ name: 'other_hash_id' });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Bill not exists');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should return an error when updating a bill with invalid data', async () => {
      const vendor = await vendorModel.create({
         _id: 'any_vendor_id',
         name: 'any_vendor_name',
         userId: 'any_user_id',
      });
      const bill = await new BillBuilder().buildAndCreateModel();
      const response = await request(app)
         .put(`/api/bill/${bill.id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({
            vendorId: 'any_vendor_id',
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
         'message',
         'bill: Name is required, bill: Items is required, '
      );
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
            .withId('any_hash_id_2')
            .createModel();

         await new BillBuilder()
            .withName('other_bill')
            .withId('any_hash_id_3')
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
         expect(response.body.data.bills[0]).toHaveProperty(
            'date',
            bill.date.toISOString().split('T')[0]
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill.vendorId
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'description',
            bill.description
         );
         expect(response.body.data.bills[0]).toHaveProperty('createdAt');
         expect(response.body.data.bills[0]).toHaveProperty('updatedAt');
      });

      it('should get all bills by vendorId', async () => {
         const bill = await new BillBuilder().buildAndCreateModel();
         await new BillBuilder()
            .withVendorId('other_vendor_id')
            .withId('any_hash_id_2')
            .createModel();

         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               vendorId: 'any_vendor_id',
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
         expect(response.body.data.bills[0]).toHaveProperty(
            'date',
            bill.date.toISOString().split('T')[0]
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill.vendorId
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'description',
            bill.description
         );
         expect(response.body.data.bills[0]).toHaveProperty('createdAt');
         expect(response.body.data.bills[0]).toHaveProperty('updatedAt');
      });

      it('should get all bills by startDate', async () => {
         const bill = await new BillBuilder().buildAndCreateModel();

         await new BillBuilder()
            .withId('any_hash_id_2')
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
         expect(response.body.data.bills[0]).toHaveProperty('name', bill.name);
         expect(response.body.data.bills[0]).toHaveProperty(
            'date',
            bill.date.toISOString().split('T')[0]
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill.vendorId
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'description',
            bill.description
         );
         expect(response.body.data.bills[0]).toHaveProperty('createdAt');
         expect(response.body.data.bills[0]).toHaveProperty('updatedAt');
      });

      it('should get all bills by endDate', async () => {
         await new BillBuilder().buildAndCreateModel();
         const bill = await new BillBuilder()
            .withId('any_hash_id_2')
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
         expect(response.body.data.bills[0]).toHaveProperty('name', bill.name);
         expect(response.body.data.bills[0]).toHaveProperty(
            'date',
            bill.date.toISOString().split('T')[0]
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill.vendorId
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'description',
            bill.description
         );
         expect(response.body.data.bills[0]).toHaveProperty('createdAt');
         expect(response.body.data.bills[0]).toHaveProperty('updatedAt');
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
         .delete(`/api/bill/non-existent-id`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bill not found');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should throw an error when try create a bill with an invalid item', async () => {
      await vendorModel.create({
         _id: 'any_vendor_id',
         name: 'any_vendor_name',
         userId: 'any_user_id',
      });
      const response = await request(app)
         .post('/api/bill')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_bill_name',
            description: 'any_bill_description',
            vendorId: 'any_vendor_id',
            items: [{ itemId: 'non-existent-id', price: 10, quantity: 1 }],
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Item not found');
      expect(response.body).not.toHaveProperty('data');
   });

   it('should get the summary of the bills by period MONTH', async () => {
      await new BillBuilder().createModel();
      await new BillBuilder()
         .withId('any_hash_id_2')
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
      await new BillBuilder().withId('any_hash_id_2').createModel();
      await new BillBuilder()
         .withId('any_hash_id_3')
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
         .withId('any_hash_id_3')
         .withDate(todayMinusThreeMonths)
         .createModel();
      await new BillBuilder()
         .withId('any_hash_id_2')
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
         .withId('any_hash_id_2')
         .withDate(todayMinusOneMonth)
         .createModel();
      await new BillBuilder()
         .withId('any_hash_id_3')
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
      expect(response.body).toHaveProperty('message', 'Invalid period');
   });
});
