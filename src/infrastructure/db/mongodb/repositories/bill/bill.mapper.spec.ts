import BillItem from '@core/domain/bill/entity/bill-item.entity';
import billModel from '../../model/bill.model';
import mockDb from '../__mocks__/mockDb';
import { BillMapper } from './bill.mapper';

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
      const bill = await billModel.create({
         _id: 'any_id',
         name: 'any_name',
         date,
         total: 20,
         items: [
            {
               _id: 'any_item_id',
               itemId: 'any_item_id',
               price: 10,
               quantity: 2,
            },
         ],
         vendorId: 'any_vendor_id',
         userId: 'any_user_id',
      });
      const billMapped = BillMapper.toDomain(bill);
      expect(billMapped.id).toBe('any_id');
      expect(billMapped.name).toBe('any_name');
      expect(billMapped.date).toEqual(date);
      expect(billMapped.items).toHaveLength(1);
      expect(billMapped.items[0].id).toBe('any_item_id');
      expect(billMapped.items[0].price).toBe(10);
      expect(billMapped.items[0].quantity).toBe(2);
      expect(billMapped.vendorId).toBe('any_vendor_id');
      expect(billMapped.userId).toBe('any_user_id');
   });

   it('should map a bill model to a bill domain list', async () => {
      const date = new Date();
      const bills = await billModel.insertMany([
         {
            _id: 'any_id',
            name: 'any_name',
            date,
            total: 20,
            items: [
               {
                  _id: 'any_item_id',
                  itemId: 'any_item_id',
                  price: 10,
                  quantity: 2,
               },
            ],
            vendorId: 'any_vendor_id',
            userId: 'any_user_id',
         },
         {
            _id: 'any_id_2',
            name: 'any_name_2',
            date,
            total: 20,
            items: [
               {
                  _id: 'any_item_id_2',
                  itemId: 'any_item_id_2',
                  price: 10,
                  quantity: 2,
               },
            ],
            vendorId: 'any_vendor_id_2',
            userId: 'any_user_id_2',
         },
      ]);
      const billMapped = BillMapper.toDomainList(bills);
      expect(billMapped).toHaveLength(2);
      expect(billMapped[0].id).toBe('any_id');
      expect(billMapped[0].name).toBe('any_name');
      expect(billMapped[1].id).toBe('any_id_2');
      expect(billMapped[1].name).toBe('any_name_2');
      expect(billMapped[0].items).toHaveLength(1);
      expect(billMapped[1].items).toHaveLength(1);
      expect(billMapped[0].items[0].id).toBe('any_item_id');
      expect(billMapped[1].items[0].id).toBe('any_item_id_2');
      expect(billMapped[0].items[0].price).toBe(10);
      expect(billMapped[1].items[0].price).toBe(10);
   });
});
