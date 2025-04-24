import Category from '@core/domain/category/entity/category.entity';
import mockDb from '../__mocks__/mockDb';
import Bill from '@core/domain/bill/entity/bill.entity';
import BillItem from '@core/domain/bill/entity/bill-item.entity';
import BillModel from '../../model/bill.model';
import ItemModel from '../../model/item.model';
import MongoDbBillRepository from './bill.repository';
import Item from '@core/domain/item/entity/item.entity';

beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   await mockDb.clear();
});

afterAll(async () => {
   await mockDb.disconnect();
});
describe('MongoDB Item Repository tests', () => {
   it('should create a bill', async () => {
      const sut = new MongoDbBillRepository();
      const billItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const bill = new Bill(
         'any_id',
         'any_name',
         [billItem],
         new Date(),
         'any_user_id'
      );
      await sut.create(bill);
      const billCreated = await BillModel.findOne({ _id: bill.id });
      expect(billCreated).toBeTruthy();
      expect(billCreated?._id).toBe(bill.id);
      expect(billCreated?.name).toBe(bill.name);
      expect(billCreated?.userId).toBe(bill.userId);
      expect(billCreated?.description).toBeUndefined();
      expect(billCreated?.items).toHaveLength(1);
   });
   it('should update a bill', async () => {
      const sut = new MongoDbBillRepository();
      const oldBillItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const oldBill = new Bill(
         'any_id',
         'any_name',
         [oldBillItem],
         new Date(),
         'any_user_id',
         'any_description'
      );
      await BillModel.create({
         _id: oldBill.id,
         name: oldBill.name,
         userId: oldBill.userId,
         description: oldBill.description,
         createdDate: new Date(),
         items: [oldBillItem],
      });

      const billCreated = await BillModel.findOne({ _id: oldBill.id });
      expect(billCreated).toBeTruthy();
      expect(billCreated?._id).toBe(oldBill.id);
      expect(billCreated?.name).toBe(oldBill.name);
      expect(billCreated?.description).toBe(oldBill.description);
      expect(billCreated?.items).toHaveLength(1);

      const updateBillItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const updateBill = new Bill(
         'any_id',
         'any_name_2',
         [updateBillItem, updateBillItem],
         new Date(),
         'any_user_id',
         'any_other_description'
      );
      await sut.update(updateBill);
      const billUpdated = await BillModel.findOne({ _id: oldBill.id });
      expect(billUpdated?._id).toBe(updateBill.id);
      expect(billUpdated?.name).toBe(updateBill.name);
      expect(billUpdated?.description).toBe(updateBill.description);
      expect(billUpdated?.userId).toBe(updateBill.userId);
      expect(billUpdated?.items).toHaveLength(2);
   });

   it('should find a bill', async () => {
      const sut = new MongoDbBillRepository();

      const oldItem = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'Description 1'
      );
      const item = await ItemModel.create({
         _id: oldItem.id,
         name: oldItem.name,
         description: oldItem.description,
         categoryId: oldItem.categoryId,
      });

      const billItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const bill = new Bill(
         'any_id',
         'any_name',
         [billItem],
         new Date(),
         'any_user_id',
         'any_description'
      );
      billItem.itemId = item.id;
      await BillModel.create({
         _id: bill.id,
         name: bill.name,
         userId: bill.userId,
         description: bill.description,
         createdDate: new Date(),
         items: [billItem],
      });
      const billFound = await sut.find(bill.id);
      expect(billFound?.id).toBe(bill.id);
      expect(billFound?.name).toBe(bill.name);
      expect(billFound?.userId).toBe(bill.userId);
      expect(billFound?.description).toBe(bill.description);
   });

   it('should find all bills', async () => {
      const sut = new MongoDbBillRepository();
      const billItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const bill1 = new Category('any_hash_id', 'Category 1', 'Description 1');
      await BillModel.create({
         _id: bill1.id,
         name: bill1.name,
         userId: 'any_user_id',
         description: bill1.description,
         createdDate: new Date(),
         items: [billItem],
      });
      const bill2 = new Category(
         'any_hash_id_2',
         'Category 2',
         'Description 2'
      );
      await BillModel.create({
         _id: bill2.id,
         name: bill2.name,
         userId: 'any_user_id',
         description: bill2.description,
         createdDate: new Date(),
         items: [billItem, billItem],
      });
      const billsFound = await sut.findAll();
      expect(billsFound).toHaveLength(2);
      expect(billsFound[0].id).toBe(bill1.id);
      expect(billsFound[0].name).toBe(bill1.name);
      expect(billsFound[0].items.length).toBe(1);
      expect(billsFound[0].userId).toBe('any_user_id');
      expect(billsFound[0].description).toBe(bill1.description);
      expect(billsFound[1].id).toBe(bill2.id);
      expect(billsFound[1].userId).toBe('any_user_id');
      expect(billsFound[1].name).toBe(bill2.name);
      expect(billsFound[1].description).toBe(bill2.description);
      expect(billsFound[1].items.length).toBe(2);
   });

   it('should delete a bill', async () => {
      const sut = new MongoDbBillRepository();
      const billItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const bill = new Category('any_hash_id', 'Category 1', 'Description 1');
      await BillModel.create({
         _id: bill.id,
         name: bill.name,
         userId: 'any_user_id',
         description: bill.description,
         createdDate: new Date(),
         items: [billItem],
      });
      await sut.delete(bill.id);
      const billFound = await BillModel.findOne({ _id: bill.id });
      expect(billFound).toBeFalsy();
   });
});
