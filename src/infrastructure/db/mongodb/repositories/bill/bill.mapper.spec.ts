import BillItem from '@core/domain/bill/entity/bill-item.vo';
import billModel from '../../model/bill.model';
import mockDb from '../__mocks__/mockDb';
import { BillMapper } from './bill.mapper';
import { BillId } from '@core/domain/bill/entity/bill.entity';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
import { ItemId } from '@core/domain/item/entity/item.entity';

describe('BillMapper', () => {
   beforeAll(async () => {
      await mockDb.connect();
   });

   beforeEach(async () => {
      await mockDb.clear();
   });

   afterAll(async () => {
      await mockDb.disconnect();
   });
   it('should map a bill model to a bill domain', async () => {
      const date = new Date();
      const billId = new BillId();
      const itemId = new ItemId();
      const vendorId = new VendorId();
      const userId = new UserId();
      const bill = await billModel.create({
         _id: billId.id,
         name: 'any_name',
         date,
         total: 20,
         items: [
            {
               itemId: itemId.id,
               price: 10,
               quantity: 2,
            },
         ],
         vendorId: vendorId.id,
         userId: userId.id,
      });
      const billMapped = BillMapper.toDomain(bill);
      expect(billMapped.id).toBe(billId.id);
      expect(billMapped.name).toBe('any_name');
      expect(billMapped.date).toEqual(date);
      expect(billMapped.items).toHaveLength(1);
      expect(billMapped.items[0].itemId.id).toBe(itemId.id);
      expect(billMapped.items[0].price).toBe(10);
      expect(billMapped.items[0].quantity).toBe(2);
      expect(billMapped.vendorId.id).toBe(vendorId.id);
      expect(billMapped.userId.id).toBe(userId.id);
   });

   it('should map a bill model to a bill domain list', async () => {
      const date = new Date();
      const billId = new BillId();
      const billId2 = new BillId();
      const itemId = new ItemId();
      const vendorId = new VendorId();
      const userId = new UserId();
      const bills = await billModel.insertMany([
         {
            _id: billId.id,
            name: 'any_name',
            date,
            total: 20,
            items: [
               {
                  itemId: itemId.id,
                  price: 10,
                  quantity: 2,
               },
            ],
            vendorId: vendorId.id,
            userId: userId.id,
         },
         {
            _id: billId2.id,
            name: 'any_name_2',
            date,
            total: 20,
            items: [
               {
                  itemId: itemId.id,
                  price: 10,
                  quantity: 2,
               },
            ],
            vendorId: vendorId.id,
            userId: userId.id,
         },
      ]);
      const billMapped = BillMapper.toDomainList(bills);
      expect(billMapped).toHaveLength(2);
      expect(billMapped[0].id).toBe(billId.id);
      expect(billMapped[0].name).toBe('any_name');
      expect(billMapped[1].id).toBe(billId2.id);
      expect(billMapped[1].name).toBe('any_name_2');
      expect(billMapped[0].items).toHaveLength(1);
      expect(billMapped[1].items).toHaveLength(1);
      expect(billMapped[0].items[0].itemId.id).toBe(itemId.id);
      expect(billMapped[1].items[0].itemId.id).toBe(itemId.id);
      expect(billMapped[0].items[0].price).toBe(10);
      expect(billMapped[1].items[0].price).toBe(10);
   });
});
