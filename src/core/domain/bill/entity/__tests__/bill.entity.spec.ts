import { ItemId } from '@core/domain/item/entity/item.entity';
import EntityError from '../../../@shared/error/entity.error';
import BillItem from '../bill-item.vo';
import Bill, { BillId } from '../bill.entity';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';

const makeBillItem = (): BillItem => {
   return new BillItem(new ItemId(), 100, 2);
};

describe('Bill entity unit tests', () => {
   it('should throw a error if name is empty ', () => {
      const item = new BillItem(new ItemId(), 100, 2);
      const bill = expect(() => {
         new Bill(
            new BillId(),
            '',
            new Date(),
            [item],
            new VendorId(),
            new UserId()
         );
      }).toThrow(new EntityError('bill: Name is required, '));
   });

   it('should throw a error if items is empty ', () => {
      expect(() => {
         new Bill(
            new BillId(),
            'Bill 1',
            new Date(),
            [],
            new VendorId(),
            new UserId()
         );
      }).toThrow(new EntityError('bill: Items is required, '));
   });

   it('should throw an error if vendorId is invalid ', () => {
      expect(() => {
         new Bill(
            new BillId(),
            'Bill 1',
            new Date(),
            [makeBillItem()],
            'invalid_vendor_id' as any,
            new UserId()
         );
      }).toThrow(new EntityError('bill: VendorId is required, '));
   });

   it('should change name', () => {
      const bill = new Bill(
         new BillId(),
         'Bill 1',
         new Date(),
         [makeBillItem()],
         new VendorId(),
         new UserId()
      );
      expect(bill.name).toBe('Bill 1');
      bill.changeName('Bill 2');
      expect(bill.name).toBe('Bill 2');
   });

   it('should change description', () => {
      const bill = new Bill(
         new BillId(),
         'Bill 1',
         new Date(),
         [makeBillItem()],
         new VendorId(),
         new UserId(),
         'Description'
      );
      expect(bill.description).toBe('Description');
      bill.changeDescription('New Description');
      expect(bill.description).toBe('New Description');
   });

   it('should calculate total correctly', () => {
      const bill1 = new Bill(
         new BillId(),
         'Bill 1',
         new Date(),
         [makeBillItem(), makeBillItem()],
         new VendorId(),
         new UserId(),
         'Description'
      );
      expect(bill1.total).toBe(400);
      const bill2 = new Bill(
         new BillId(),
         'Bill 1',
         new Date(),
         [makeBillItem()],
         new VendorId(),
         new UserId(),
         'Description'
      );
      expect(bill2.total).toBe(200);
   });

   it('should change date', () => {
      const date = new Date('2021-01-01T00:00:00.000Z');
      const bill = new Bill(
         new BillId(),
         'Bill 1',
         new Date(),
         [makeBillItem()],
         new VendorId(),
         new UserId()
      );
      bill.changeDate(date);
      expect(bill.date).toEqual(date);
   });
});
