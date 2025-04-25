import request from 'supertest';
import { app } from '../app';
import mockDb from '@infrastructure/db/mongodb/repositories/__mocks__/mockDb';
import BillModel from '@infrastructure/db/mongodb/model/bill.model';
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
describe('Bill e2e tests', () => {
   it('should create a bill', async () => {
      const response = await request(app)
         .post('/api/bill')
         .set('Authorization', 'Bearer ' + token)
         .send({
            name: 'any_bill_name',
            description: 'any_bill_description',
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
      expect(response.body.data).toHaveProperty('items');
   });

   it('should return an error when creating an bill with invalid data', async () => {
      const response = await request(app)
         .post('/api/bill')
         .set('Authorization', 'Bearer ' + token)
         .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
         'message',
         'bill: Name is required, bill: Items is required, '
      );
   });

   it('should update an bill', async () => {
      const bill = await BillModel.create({
         _id: 'any_hash_id',
         name: 'Bill 1',
         userId: 'any_user_id',
         createdDate: new Date(),
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
         .put(`/api/bill/${bill._id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({
            id: 'any_hash_id',
            name: 'any_bill_name',
            description: 'any_bill_description',
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
      const bill = await BillModel.create({
         _id: 'any_hash_id',
         name: 'Bill 1',
         userId: 'any_user_id',
         createdDate: new Date(),
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
         .put(`/api/bill/${bill.id}`)
         .set('Authorization', 'Bearer ' + token)
         .send({});
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
         createdDate: new Date(),
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
      expect(response.body.data).toHaveProperty('description', 'Description 1');
   });

   it('should get all bills', async () => {
      const bill1 = await BillModel.create({
         _id: 'any_hash_id',
         createdDate: new Date(),
         name: 'Bill 1',
         userId: 'any_user_id',
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
      const bill2 = await BillModel.create({
         _id: 'any_hash_id_2',
         createdDate: new Date(),
         name: 'Bill 2',
         userId: 'any_user_id',
         description: 'Description 2',
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
         .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty(
         'message',
         'Bills listed successfully'
      );
      expect(response.body.data.bills).toHaveLength(2);
      expect(response.body.data.bills[0]).toHaveProperty('id', bill1._id);
      expect(response.body.data.bills[0]).toHaveProperty('name', bill1.name);
      expect(response.body.data.bills[0]).toHaveProperty(
         'description',
         bill1.description
      );
      expect(response.body.data.bills[1]).toHaveProperty('id', bill2._id);
      expect(response.body.data.bills[1]).toHaveProperty('name', bill2.name);
      expect(response.body.data.bills[1]).toHaveProperty(
         'description',
         bill2.description
      );
   });

   it('should delete an bill', async () => {
      const bill = await BillModel.create({
         _id: 'any_hash_id',
         createdDate: new Date(),
         userId: 'any_user_id',
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
});
