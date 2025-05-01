import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import BillModel from '@infrastructure/db/mongodb/model/bill.model';
import token from './___mocks__/jsonwebtoken.mock';
import itemModel from '@infrastructure/db/mongodb/model/item.model';
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
describe('Bill e2e tests', () => {
   it('should create a bill', async () => {
      const item = await itemModel.create({
         _id: 'any_item_id',
         name: 'any_item_name',
         categoryId: 'any_category_id',
         description: 'any_item_description',
         userId: 'any_user_id',
      });
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
      const item = await itemModel.create({
         _id: 'any_item_id',
         name: 'any_item_name',
         categoryId: 'any_category_id',
         description: 'any_item_description',
         userId: 'any_user_id',
      });
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
      const bill = await BillModel.create({
         _id: 'any_hash_id',
         name: 'Bill 1',
         userId: 'any_user_id',
         vendorId: 'any_vendor_id',
         description: 'Description 1',
         date: new Date('2021-01-01T00:00:00.000Z'),
         items: [
            {
               _id: 'any_item_id',
               quantity: 10,
               price: 100,
               itemId: 'any_item_id',
            },
         ],
      });
      const response = await request(app)
         .put(`/api/bill/${bill._id}`)
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
      const bill = await BillModel.create({
         _id: 'any_hash_id',
         name: 'Bill 1',
         userId: 'any_user_id',
         vendorId: 'any_vendor_id',
         description: 'Description 1',
         date: new Date('2021-01-01T00:00:00.000Z'),
         items: [
            {
               _id: 'any_item_id',
               quantity: 10,
               price: 100,
               itemId: 'any_item_id',
            },
         ],
      });
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
      const bill = await BillModel.create({
         _id: 'any_hash_id',
         name: 'Bill 1',
         userId: 'any_user_id',
         vendorId: 'any_vendor_id',
         description: 'Description 1',
         date: new Date('2021-01-01T00:00:00.000Z'),
         items: [
            {
               _id: 'any_item_id',
               quantity: 10,
               price: 100,
               itemId: 'any_item_id',
            },
         ],
      });
      const response = await request(app)
         .get(`/api/bill/${bill._id}`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Bill founded successfully'
      );
      expect(response.body.data).toHaveProperty('id', bill._id);
      expect(response.body.data).toHaveProperty('name', 'Bill 1');
      expect(response.body.data).toHaveProperty('date', '2021-01-01');
      expect(response.body.data).toHaveProperty('description', 'Description 1');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
   });

   describe('/api/bills GET', () => {
      it('should get all bills by name', async () => {
         const bill1 = await BillModel.create({
            _id: 'any_hash_id',
            name: 'Bill 1',
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'Description 1',
            date: new Date('2021-01-01T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
         const bill2 = await BillModel.create({
            _id: 'any_hash_id_2',
            name: 'Bill 2',
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'Description 2',
            date: new Date('2021-01-02T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });

         const bill3 = await BillModel.create({
            _id: 'any_hash_id_3',
            name: 'other_bill',
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'Description 2',
            date: new Date('2021-01-02T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
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
         expect(response.body.data.bills[0]).toHaveProperty('id', bill1._id);
         expect(response.body.data.bills[0]).toHaveProperty('name', bill1.name);
         expect(response.body.data.bills[0]).toHaveProperty(
            'date',
            '2021-01-01'
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill1.vendorId
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'description',
            bill1.description
         );
         expect(response.body.data.bills[0]).toHaveProperty('createdAt');
         expect(response.body.data.bills[0]).toHaveProperty('updatedAt');
      });

      it('should get all bills by vendorId', async () => {
         const bill1 = await BillModel.create({
            _id: 'any_hash_id',
            name: 'Bill 1',
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'Description 1',
            date: new Date('2021-01-01T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
         await BillModel.create({
            _id: 'any_hash_id_2',
            name: 'Bill 2',
            userId: 'any_user_id',
            vendorId: 'other_vendor_id',
            description: 'Description 2',
            date: new Date('2021-01-01T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
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
         expect(response.body.data.bills[0]).toHaveProperty('id', bill1._id);
         expect(response.body.data.bills[0]).toHaveProperty('name', bill1.name);
         expect(response.body.data.bills[0]).toHaveProperty(
            'date',
            '2021-01-01'
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill1.vendorId
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'description',
            bill1.description
         );
         expect(response.body.data.bills[0]).toHaveProperty('createdAt');
         expect(response.body.data.bills[0]).toHaveProperty('updatedAt');
      });

      it('should get all bills by startDate', async () => {
         const bill1 = await BillModel.create({
            _id: 'any_hash_id',
            name: 'Bill 1',
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'Description 1',
            date: new Date('2021-01-01T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
         await BillModel.create({
            _id: 'any_hash_id_2',
            name: 'Bill 2',
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'Description 2',
            date: new Date('2020-01-02T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
         const response = await request(app)
            .get('/api/bills')
            .set('Authorization', 'Bearer ' + token)
            .query({
               startDate: '2021-01-01',
            });
         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('data');
         expect(response.body).toHaveProperty(
            'message',
            'Bills listed successfully'
         );
         expect(response.body.data.bills).toHaveLength(1);
         expect(response.body.data.bills[0]).toHaveProperty('id', bill1._id);
         expect(response.body.data.bills[0]).toHaveProperty('name', bill1.name);
         expect(response.body.data.bills[0]).toHaveProperty(
            'date',
            '2021-01-01'
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill1.vendorId
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'description',
            bill1.description
         );
         expect(response.body.data.bills[0]).toHaveProperty('createdAt');
         expect(response.body.data.bills[0]).toHaveProperty('updatedAt');
      });

      it('should get all bills by endDate', async () => {
         const bill1 = await BillModel.create({
            _id: 'any_hash_id',
            name: 'Bill 1',
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'Description 1',
            date: new Date('2021-01-01T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
         await BillModel.create({
            _id: 'any_hash_id_2',
            name: 'Bill 2',
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'Description 2',
            date: new Date('2021-01-02T00:00:00.000Z'),
            items: [
               {
                  _id: 'any_item_id',
                  quantity: 10,
                  price: 100,
                  itemId: 'any_item_id',
               },
            ],
         });
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
         expect(response.body.data.bills[0]).toHaveProperty('id', bill1._id);
         expect(response.body.data.bills[0]).toHaveProperty('name', bill1.name);
         expect(response.body.data.bills[0]).toHaveProperty(
            'date',
            '2021-01-01'
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'vendorId',
            bill1.vendorId
         );
         expect(response.body.data.bills[0]).toHaveProperty(
            'description',
            bill1.description
         );
         expect(response.body.data.bills[0]).toHaveProperty('createdAt');
         expect(response.body.data.bills[0]).toHaveProperty('updatedAt');
      });
   });
   it('should delete a bill', async () => {
      const bill = await BillModel.create({
         _id: 'any_hash_id',
         userId: 'any_user_id',
         vendorId: 'any_vendor_id',
         date: new Date('2021-01-01T00:00:00.000Z'),
         name: 'Bill 1',
         description: 'Description 1',
         items: [
            {
               _id: 'any_item_id',
               quantity: 10,
               price: 100,
               itemId: 'any_item_id',
            },
         ],
      });
      const response = await request(app)
         .delete(`/api/bill/${bill._id}`)
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
         'message',
         'Bill deleted successfully'
      );
      expect(response.body).not.toHaveProperty('data');
      const billFound = await BillModel.findOne({ _id: bill._id });
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
            items: [{ itemId: 'non-existent-id', price: 10, quantity: 1 }],
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Item not found');
      expect(response.body).not.toHaveProperty('data');
   });
});
