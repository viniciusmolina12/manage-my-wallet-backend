import { CategoryId } from '@core/domain/category/entity/category.entity';
import mockDb from '../__mocks__/mockDb';
import Bill, { BillId } from '@core/domain/bill/entity/bill.entity';
import BillItem from '@core/domain/bill/entity/bill-item.vo';
import BillModel from '../../model/bill.model';
import ItemModel from '../../model/item.model';
import MongoDbBillRepository from './bill.repository';
import { ItemId } from '@core/domain/item/entity/item.entity';
import { Filter } from '@core/domain/@shared/filter/filter';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';

class BillModelBuilder {
   static async create(bill: Bill): Promise<any> {
      return await BillModel.create({
         _id: bill.id,
         name: bill.name,
         date: bill.date,
         userId: bill.userId.id,
         vendorId: bill.vendorId.id,
         description: bill.description,
         items: bill.items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            itemId: item.itemId,
         })),
         total: bill.total,
      });
   }
}

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
      const itemId = new ItemId();
      const billItem = new BillItem(itemId, 10, 2);
      const bill = Bill.fake()
         .withId()
         .withName('any_name')
         .withDate(new Date('2021-01-01T00:00:00.000Z'))
         .withItems([billItem])
         .withVendorId(new VendorId())
         .withUserId(new UserId())
         .build();
      await sut.create(bill);
      const billCreated = await BillModel.findOne({ _id: bill.id });
      expect(billCreated).toBeTruthy();
      expect(billCreated?._id).toBe(bill.id);
      expect(billCreated?.name).toBe(bill.name);
      expect(billCreated?.userId).toBe(bill.userId.id);
      expect(billCreated?.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(billCreated?.description).toBeUndefined();
      expect(billCreated?.items).toHaveLength(1);
   });
   it('should update a bill', async () => {
      const sut = new MongoDbBillRepository();
      const bill = Bill.fake()
         .withId()
         .withName('any_name')
         .withDate(new Date('2021-01-01T00:00:00.000Z'))
         .withMakeItems({ price: 10, quantity: 2 })
         .withVendorId(new VendorId())
         .withUserId(new UserId())
         .build();
      await BillModelBuilder.create(bill);

      const billCreated = await BillModel.findOne({ _id: bill.id });
      expect(billCreated).toBeTruthy();
      expect(billCreated?._id).toBe(bill.id);
      expect(billCreated?.name).toBe(bill.name);
      expect(billCreated?.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(billCreated?.total).toBe(bill.total);
      expect(billCreated?.description).toBe(bill.description);
      expect(billCreated?.items).toHaveLength(1);

      bill.changeName('any_name_2');
      bill.changeDate(new Date('2021-01-02T00:00:00.000Z'));
      bill.changeDescription('any_other_description');
      bill.replaceItems([
         new BillItem(new ItemId(), 10, 2),
         new BillItem(new ItemId(), 10, 2),
      ]);
      await sut.update(bill);
      const billUpdated = await BillModel.findOne({ _id: bill.id });
      expect(billUpdated?._id).toBe(bill.id);
      expect(billUpdated?.name).toBe('any_name_2');
      expect(billUpdated?.date).toEqual(new Date('2021-01-02T00:00:00.000Z'));
      expect(billUpdated?.description).toBe('any_other_description');
      expect(billUpdated?.total).toBe(bill.total);
      expect(billUpdated?.userId).toBe(bill.userId.id);
      expect(billUpdated?.items).toHaveLength(2);
   });

   it('should find a bill', async () => {
      const sut = new MongoDbBillRepository();

      await ItemModel.create({
         _id: new ItemId().id,
         name: 'any_item_name',
         description: 'any_description',
         categoryId: new CategoryId().id,
         userId: new UserId().id,
      });
      const bill = Bill.fake()
         .withId()
         .withName('any_name')
         .withDate(new Date('2021-01-01T00:00:00.000Z'))
         .withMakeItems({ price: 10, quantity: 2 })
         .withVendorId(new VendorId())
         .withUserId(new UserId())
         .withDescription('any_description')
         .build();
      await BillModelBuilder.create(bill);

      const billFound = await sut.findByUser(bill.id, bill.userId.id);
      expect(billFound?.id).toBe(bill.id);
      expect(billFound?.name).toBe(bill.name);
      expect(billFound?.userId).toEqual(bill.userId);
      expect(billFound?.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(billFound?.description).toBe(bill.description);
   });

   describe('findAllByUser', () => {
      it('should find all bills by name', async () => {
         const sut = new MongoDbBillRepository();
         const userId = new UserId();
         const billId = new BillId();
         const bill = Bill.fake()
            .withId(billId)
            .withName('any_name')
            .withDate(new Date('2021-01-01T00:00:00.000Z'))
            .withMakeItems({ price: 10, quantity: 2 })
            .withVendorId()
            .withUserId(userId)
            .build();
         await BillModelBuilder.create(bill);

         bill['_id'] = new BillId();
         bill.changeName('other_name');
         await BillModelBuilder.create(bill);

         const filter = new Filter(1, 10, 'asc', {
            name: 'any_name',
         });
         const billsFound = await sut.findAllByUser(userId.id, filter);
         expect(billsFound.data).toHaveLength(1);
         expect(billsFound.page).toBe(1);
         expect(billsFound.perPage).toBe(10);
         expect(billsFound.total).toBe(1);
         expect(billsFound.hasNext).toBe(false);
         expect(billsFound.data[0].id).toBe(billId.id);
         expect(billsFound.data[0].date).toEqual(
            new Date('2021-01-01T00:00:00.000Z')
         );
         expect(billsFound.data[0].name).toBe('any_name');
      });

      it('should find all bills by date', async () => {
         const sut = new MongoDbBillRepository();
         const userId = new UserId();
         const foundedBillId1 = new BillId();
         const foundedBillId2 = new BillId();
         const bill = Bill.fake()
            .withId(foundedBillId1)
            .withName('any_name')
            .withDate(new Date('2021-01-01T00:00:00.000Z'))
            .withMakeItems({ price: 10, quantity: 2 })
            .withVendorId()
            .withUserId(userId)
            .build();
         await BillModelBuilder.create(bill);

         bill['_id'] = foundedBillId2;
         bill.changeDate(new Date('2021-01-02T00:00:00.000Z'));
         await BillModelBuilder.create(bill);

         bill['_id'] = new BillId();
         bill.changeDate(new Date('2021-01-03T00:00:00.000Z'));
         await BillModelBuilder.create(bill);

         const filter = new Filter(1, 10, 'asc', {
            startDate: new Date('2021-01-01T00:00:00.000Z'),
            endDate: new Date('2021-01-02T00:00:00.000Z'),
         });
         const billsFound = await sut.findAllByUser(userId.id, filter);
         expect(billsFound.data).toHaveLength(2);
         expect(billsFound.data[0].id).toBe(foundedBillId1.id);
         expect(billsFound.data[0].date).toEqual(
            new Date('2021-01-01T00:00:00.000Z')
         );
         expect(billsFound.data[1].id).toBe(foundedBillId2.id);
         expect(billsFound.data[1].date).toEqual(
            new Date('2021-01-02T00:00:00.000Z')
         );
      });

      it('should find all bills by vendorId', async () => {
         const sut = new MongoDbBillRepository();
         const vendorId = new VendorId();
         const userId = new UserId();
         const billId = new BillId();
         const bill = Bill.fake()
            .withId(billId)
            .withName('any_name')
            .withDate(new Date('2021-01-01T00:00:00.000Z'))
            .withMakeItems({ price: 10, quantity: 2 })
            .withVendorId(vendorId)
            .withUserId(userId)
            .build();
         await BillModelBuilder.create(bill);

         bill['_id'] = new BillId();
         bill.changeVendor(new VendorId());
         await BillModelBuilder.create(bill);

         const filter = new Filter(1, 10, 'asc', {
            vendorId: vendorId.id,
         });
         const billsFound = await sut.findAllByUser(userId.id, filter);
         expect(billsFound.data).toHaveLength(1);
         expect(billsFound.data[0].id).toBe(billId.id);
         expect(billsFound.data[0].vendorId).toEqual(vendorId);
      });

      it('should find all bills by userId', async () => {
         const sut = new MongoDbBillRepository();
         const userId = new UserId();
         const billId = new BillId();
         const bill = Bill.fake()
            .withId(billId)
            .withName('any_name')
            .withDate(new Date('2021-01-01T00:00:00.000Z'))
            .withMakeItems({ price: 10, quantity: 2 })
            .withVendorId()
            .withUserId(userId)
            .build();
         await BillModelBuilder.create(bill);

         bill['_id'] = new BillId();
         bill.userId = new UserId();
         await BillModelBuilder.create(bill);

         const filter = new Filter(1, 10, 'asc', {});
         const billsFound = await sut.findAllByUser(userId.id, filter);
         expect(billsFound.data).toHaveLength(1);
         expect(billsFound.data[0].id).toBe(billId.id);
         expect(billsFound.data[0].userId).toEqual(userId);
      });

      it('should return total of bills', async () => {
         const sut = new MongoDbBillRepository();
         const userId = new UserId();
         for (let i = 0; i < 20; i++) {
            const bill = Bill.fake()
               .withId()
               .withName('any_name')
               .withDate(new Date('2021-01-01T00:00:00.000Z'))
               .withMakeItems({ price: 10, quantity: 2 })
               .withVendorId()
               .withUserId(userId)
               .build();
            await BillModelBuilder.create(bill);
         }
         const filter = new Filter(1, 10, 'asc', {});
         const billsFound = await sut.findAllByUser(userId.id, filter);
         expect(billsFound.total).toBe(20);
         expect(billsFound.hasNext).toBe(true);
      });

      it('should return hasNext false when total is less than limit', async () => {
         const sut = new MongoDbBillRepository();
         const userId = new UserId();
         for (let i = 0; i < 10; i++) {
            const bill = Bill.fake()
               .withId()
               .withName('any_name')
               .withDate(new Date('2021-01-01T00:00:00.000Z'))
               .withMakeItems({ price: 10, quantity: 2 })
               .withVendorId()
               .withUserId(userId)
               .build();
            await BillModelBuilder.create(bill);
         }
         const filter = new Filter(1, 10, 'asc', {});
         const billsFound = await sut.findAllByUser(userId.id, filter);
         expect(billsFound.hasNext).toBe(false);
      });

      it('should paginate bills', async () => {
         const sut = new MongoDbBillRepository();
         const userId = new UserId();
         const itemId = new ItemId();

         await ItemModel.create({
            _id: itemId,
            name: 'any_item_name',
            description: 'any_item_description',
            categoryId: new CategoryId(),
            userId: userId,
         });

         for (let i = 0; i < 25; i++) {
            await BillModel.create({
               _id: new BillId().id,
               name: 'any_name',
               date: new Date('2021-01-01T00:00:00.000Z'),
               userId: userId.id,
               vendorId: new VendorId().id,
               description: 'any_description_1',
               items: [
                  {
                     itemId: itemId.id,
                     price: 10,
                     quantity: 2,
                  },
               ],
               total: 20,
            });
         }
         const filter = new Filter(2, 10, 'asc', {});
         const billsFound = await sut.findAllByUser(userId.id, filter);
         expect(billsFound.data).toHaveLength(10);
         expect(billsFound.page).toBe(2);
         expect(billsFound.perPage).toBe(10);
         expect(billsFound.total).toBe(25);
         expect(billsFound.hasNext).toBe(true);
      });
   });

   it('should delete a bill', async () => {
      const sut = new MongoDbBillRepository();
      const billId = new BillId();
      const userId = new UserId();
      await BillModel.create({
         _id: billId.id,
         name: 'any_name',
         date: new Date('2021-01-01T00:00:00.000Z'),
         userId: userId.id,
         vendorId: new VendorId().id,
         description: 'any_description',
         items: [
            {
               itemId: new ItemId().id,
               price: 10,
               quantity: 2,
            },
         ],
         total: 20,
      });
      await sut.deleteByUser(billId.id, userId.id);
      const billFound = await BillModel.findOne({ _id: billId.id });
      expect(billFound).toBeFalsy();
   });

   it('should find all bills by user and period', async () => {
      const sut = new MongoDbBillRepository();
      const userId = new UserId();
      const billId = new BillId();
      const bill = Bill.fake()
         .withId(billId)
         .withName('any_name')
         .withDate(new Date('2021-01-01T00:00:00.000Z'))
         .withMakeItems({ price: 10, quantity: 2 })
         .withVendorId()
         .withUserId(userId)
         .build();
      await BillModelBuilder.create(bill);

      bill['_id'] = new BillId();
      bill.changeDate(new Date('2021-01-03T00:00:00.000Z'));
      await BillModelBuilder.create(bill);

      const billsFound = await sut.findAllByUserAndPeriod(
         userId.id,
         new Date('2021-01-01T00:00:00.000Z'),
         new Date('2021-01-02T00:00:00.000Z')
      );
      expect(billsFound).toHaveLength(1);
      expect(billsFound[0].id).toBe(billId.id);
   });
});
