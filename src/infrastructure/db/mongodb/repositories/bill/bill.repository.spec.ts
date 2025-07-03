import Category from '@core/domain/category/entity/category.entity';
import mockDb from '../__mocks__/mockDb';
import Bill from '@core/domain/bill/entity/bill.entity';
import BillItem from '@core/domain/bill/entity/bill-item.entity';
import BillModel from '../../model/bill.model';
import ItemModel from '../../model/item.model';
import MongoDbBillRepository from './bill.repository';
import Item from '@core/domain/item/entity/item.entity';
import { Filter } from '@core/domain/@shared/filter/filter';

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
         new Date('2021-01-01T00:00:00.000Z'),
         [billItem],
         'any_vendor_id',
         'any_user_id'
      );
      await sut.create(bill);
      const billCreated = await BillModel.findOne({ _id: bill.id });
      expect(billCreated).toBeTruthy();
      expect(billCreated?._id).toBe(bill.id);
      expect(billCreated?.name).toBe(bill.name);
      expect(billCreated?.userId).toBe(bill.userId);
      expect(billCreated?.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(billCreated?.description).toBeUndefined();
      expect(billCreated?.items).toHaveLength(1);
   });
   it('should update a bill', async () => {
      const sut = new MongoDbBillRepository();
      const oldBillItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const oldBill = new Bill(
         'any_id',
         'any_name',
         new Date('2021-01-01T00:00:00.000Z'),
         [oldBillItem],
         'any_vendor_id',
         'any_user_id',
         'any_description'
      );
      await BillModel.create({
         _id: oldBill.id,
         name: oldBill.name,
         date: oldBill.date,
         userId: oldBill.userId,
         vendorId: oldBill.vendorId,
         description: oldBill.description,
         total: oldBill.total,
         items: [oldBillItem],
      });

      const billCreated = await BillModel.findOne({ _id: oldBill.id });
      expect(billCreated).toBeTruthy();
      expect(billCreated?._id).toBe(oldBill.id);
      expect(billCreated?.name).toBe(oldBill.name);
      expect(billCreated?.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(billCreated?.total).toBe(oldBill.total);
      expect(billCreated?.description).toBe(oldBill.description);
      expect(billCreated?.items).toHaveLength(1);

      const updateBillItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const updateBill = new Bill(
         'any_id',
         'any_name_2',
         new Date('2021-01-02T00:00:00.000Z'),
         [updateBillItem, updateBillItem],
         'any_vendor_id',
         'any_user_id',
         'any_other_description'
      );
      await sut.update(updateBill);
      const billUpdated = await BillModel.findOne({ _id: oldBill.id });
      expect(billUpdated?._id).toBe(updateBill.id);
      expect(billUpdated?.name).toBe(updateBill.name);
      expect(billUpdated?.date).toEqual(new Date('2021-01-02T00:00:00.000Z'));
      expect(billUpdated?.description).toBe(updateBill.description);
      expect(billUpdated?.total).toBe(updateBill.total);
      expect(billUpdated?.userId).toBe(updateBill.userId);
      expect(billUpdated?.items).toHaveLength(2);
   });

   it('should find a bill', async () => {
      const sut = new MongoDbBillRepository();

      const oldItem = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id'
      );
      const item = await ItemModel.create({
         _id: oldItem.id,
         name: oldItem.name,
         description: oldItem.description,
         categoryId: oldItem.categoryId,
         userId: oldItem.userId,
      });

      const billItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const bill = new Bill(
         'any_id',
         'any_name',
         new Date('2021-01-01T00:00:00.000Z'),
         [billItem],
         'any_vendor_id',
         'any_user_id',
         'any_description'
      );
      billItem.itemId = item.id;
      await BillModel.create({
         _id: bill.id,
         name: bill.name,
         date: bill.date,
         userId: bill.userId,
         vendorId: bill.vendorId,
         description: bill.description,
         items: [billItem],
         total: bill.total,
      });

      const billFound = await sut.findByUser(bill.id, bill.userId);
      expect(billFound?.id).toBe(bill.id);
      expect(billFound?.name).toBe(bill.name);
      expect(billFound?.userId).toBe(bill.userId);
      expect(billFound?.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(billFound?.description).toBe(bill.description);
   });

   describe('findAllByUser', () => {
      it('should find all bills by name', async () => {
         const sut = new MongoDbBillRepository();
         const billItem = new BillItem('any_id', 'any_item_id', 10, 2);

         await BillModel.create({
            _id: 'any_id_1',
            name: 'any_name',
            date: new Date('2021-01-01T00:00:00.000Z'),
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'any_description_1',
            items: [billItem],
            total: 20,
         });

         await BillModel.create({
            _id: 'any_id_2',
            name: 'other_name',
            date: new Date('2021-01-02T00:00:00.000Z'),
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'any_description_2',
            items: [billItem, billItem],
            total: 40,
         });
         const filter = new Filter(1, 10, 'asc', {
            name: 'any_name',
         });
         const billsFound = await sut.findAllByUser('any_user_id', filter);
         expect(billsFound.data).toHaveLength(1);
         expect(billsFound.page).toBe(1);
         expect(billsFound.perPage).toBe(10);
         expect(billsFound.total).toBe(1);
         expect(billsFound.hasNext).toBe(false);
         expect(billsFound.data[0].id).toBe('any_id_1');
         expect(billsFound.data[0].date).toEqual(
            new Date('2021-01-01T00:00:00.000Z')
         );
         expect(billsFound.data[0].name).toBe('any_name');
      });

      it('should find all bills by date', async () => {
         const sut = new MongoDbBillRepository();
         const billItem = new BillItem('any_id', 'any_item_id', 10, 2);

         await BillModel.create({
            _id: 'any_id_1',
            name: 'any_name',
            date: new Date('2021-01-01T00:00:00.000Z'),
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'any_description_1',
            items: [billItem],
            total: 20,
         });

         await BillModel.create({
            _id: 'any_id_2',
            name: 'any_name',
            date: new Date('2021-01-02T00:00:00.000Z'),
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'any_description_2',
            items: [billItem],
            total: 20,
         });

         await BillModel.create({
            _id: 'any_id_3',
            name: 'should_not_be_found',
            date: new Date('2021-01-03T00:00:00.000Z'),
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'any_description_2',
            items: [billItem],
            total: 20,
         });

         const filter = new Filter(1, 10, 'asc', {
            startDate: new Date('2021-01-01T00:00:00.000Z'),
            endDate: new Date('2021-01-02T00:00:00.000Z'),
         });
         const billsFound = await sut.findAllByUser('any_user_id', filter);
         expect(billsFound.data).toHaveLength(2);
         expect(billsFound.data[0].id).toBe('any_id_1');
         expect(billsFound.data[0].date).toEqual(
            new Date('2021-01-01T00:00:00.000Z')
         );
         expect(billsFound.data[1].id).toBe('any_id_2');
         expect(billsFound.data[1].date).toEqual(
            new Date('2021-01-02T00:00:00.000Z')
         );
      });

      it('should find all bills by vendorId', async () => {
         const sut = new MongoDbBillRepository();
         const billItem = new BillItem('any_id', 'any_item_id', 10, 2);

         await BillModel.create({
            _id: 'any_id_1',
            name: 'any_name',
            date: new Date('2021-01-01T00:00:00.000Z'),
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'any_description_1',
            items: [billItem],
            total: 20,
         });

         await BillModel.create({
            _id: 'any_id_2',
            name: 'any_name',
            date: new Date('2021-01-02T00:00:00.000Z'),
            userId: 'any_user_id',
            vendorId: 'other_vendor_id',
            description: 'any_description_2',
            items: [billItem],
            total: 20,
         });

         const filter = new Filter(1, 10, 'asc', {
            vendorId: 'any_vendor_id',
         });
         const billsFound = await sut.findAllByUser('any_user_id', filter);
         expect(billsFound.data).toHaveLength(1);
         expect(billsFound.data[0].id).toBe('any_id_1');
         expect(billsFound.data[0].vendorId).toBe('any_vendor_id');
      });

      it('should find all bills by userId', async () => {
         const sut = new MongoDbBillRepository();
         const billItem = new BillItem('any_id', 'any_item_id', 10, 2);

         await BillModel.create({
            _id: 'any_id_1',
            name: 'any_name',
            date: new Date('2021-01-01T00:00:00.000Z'),
            userId: 'any_user_id',
            vendorId: 'any_vendor_id',
            description: 'any_description_1',
            items: [billItem],
            total: 20,
         });

         await BillModel.create({
            _id: 'any_id_2',
            name: 'any_name',
            date: new Date('2021-01-02T00:00:00.000Z'),
            userId: 'other_user_id',
            vendorId: 'any_vendor_id',
            description: 'any_description_2',
            items: [billItem],
            total: 20,
         });

         const filter = new Filter(1, 10, 'asc', {});
         const billsFound = await sut.findAllByUser('any_user_id', filter);
         expect(billsFound.data).toHaveLength(1);
         expect(billsFound.data[0].id).toBe('any_id_1');
         expect(billsFound.data[0].userId).toBe('any_user_id');
      });

      it('should return total of bills', async () => {
         const sut = new MongoDbBillRepository();
         const billItem = new BillItem('any_id', 'any_item_id', 10, 2);

         for (let i = 0; i < 20; i++) {
            await BillModel.create({
               _id: `any_id_${i}`,
               name: 'any_name',
               date: new Date('2021-01-01T00:00:00.000Z'),
               userId: 'any_user_id',
               vendorId: 'any_vendor_id',
               description: 'any_description_1',
               items: [billItem],
               total: 20,
            });
         }
         const filter = new Filter(1, 10, 'asc', {});
         const billsFound = await sut.findAllByUser('any_user_id', filter);
         expect(billsFound.total).toBe(20);
         expect(billsFound.hasNext).toBe(true);
      });

      it('should return hasNext false when total is less than limit', async () => {
         const sut = new MongoDbBillRepository();
         const billItem = new BillItem('any_id', 'any_item_id', 10, 2);

         for (let i = 0; i < 10; i++) {
            await BillModel.create({
               _id: `any_id_${i}`,
               name: 'any_name',
               date: new Date('2021-01-01T00:00:00.000Z'),
               userId: 'any_user_id',
               vendorId: 'any_vendor_id',
               description: 'any_description_1',
               items: [billItem],
               total: 20,
            });
         }
         const filter = new Filter(1, 10, 'asc', {});
         const billsFound = await sut.findAllByUser('any_user_id', filter);
         expect(billsFound.hasNext).toBe(false);
      });

      it('should paginate bills', async () => {
         const sut = new MongoDbBillRepository();
         const billItem = new BillItem('any_id', 'any_item_id', 10, 2);

         for (let i = 0; i < 25; i++) {
            await BillModel.create({
               _id: `any_id_${i}`,
               name: 'any_name',
               date: new Date('2021-01-01T00:00:00.000Z'),
               userId: 'any_user_id',
               vendorId: 'any_vendor_id',
               description: 'any_description_1',
               items: [billItem],
               total: 20,
            });
         }
         const filter = new Filter(2, 10, 'asc', {});
         const billsFound = await sut.findAllByUser('any_user_id', filter);
         expect(billsFound.data).toHaveLength(10);
         expect(billsFound.page).toBe(2);
         expect(billsFound.perPage).toBe(10);
         expect(billsFound.total).toBe(25);
         expect(billsFound.hasNext).toBe(true);
      });
   });

   it('should delete a bill', async () => {
      const sut = new MongoDbBillRepository();
      const billItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const bill = new Category('any_hash_id', 'Category 1', 'Description 1');
      await BillModel.create({
         _id: bill.id,
         name: bill.name,
         date: new Date('2021-01-01T00:00:00.000Z'),
         userId: 'any_user_id',
         vendorId: 'any_vendor_id',
         description: bill.description,
         items: [billItem],
         total: 20,
      });
      await sut.deleteByUser(bill.id, 'any_user_id');
      const billFound = await BillModel.findOne({ _id: bill.id });
      expect(billFound).toBeFalsy();
   });

   it('should find all bills by user and period', async () => {
      const sut = new MongoDbBillRepository();
      const billItem = new BillItem('any_id', 'any_item_id', 10, 2);
      const bill = new Bill(
         'any_id',
         'any_name',
         new Date('2021-01-01T00:00:00.000Z'),
         [billItem],
         'any_vendor_id',
         'any_user_id'
      );
      await BillModel.create({
         _id: bill.id,
         name: bill.name,
         date: bill.date,
         userId: bill.userId,
         vendorId: bill.vendorId,
         description: bill.description,
         items: [billItem],
         total: 20,
      });

      await BillModel.create({
         _id: 'any_id_2',
         name: 'unfound_bill',
         date: new Date('2021-01-03T00:00:00.000Z'),
         userId: bill.userId,
         vendorId: bill.vendorId,
         description: bill.description,
         items: [billItem],
         total: 20,
      });

      const billsFound = await sut.findAllByUserAndPeriod(
         'any_user_id',
         new Date('2021-01-01T00:00:00.000Z'),
         new Date('2021-01-02T00:00:00.000Z')
      );
      expect(billsFound).toHaveLength(1);
      expect(billsFound[0].id).toBe(bill.id);
   });
});
