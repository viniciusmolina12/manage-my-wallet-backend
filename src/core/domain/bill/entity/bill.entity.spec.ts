import EntityError from '../../@shared/error/entity.error';
import BillItem from './bill-item.entity';
import Bill from './bill.entity';

const makeBillItem = (): BillItem => {
   return new BillItem('1', '1', 100, 2);
};

describe('Bill entity unit tests', () => {
   it('should throw a error if id is empty ', () => {
      expect(() => {
         const bill = new Bill('', 'Bill 1', [makeBillItem()], new Date());
      }).toThrowError(new EntityError('bill: Id is required, '));
   });

   it('should throw a error if name is empty ', () => {
      const item = new BillItem('1', '1', 100, 2);
      expect(() => {
         const bill = new Bill('1', '', [makeBillItem()], new Date());
      }).toThrowError(new EntityError('bill: Name is required, '));
   });

   it('should throw a error if items is empty ', () => {
      expect(() => {
         const bill = new Bill('1', 'Bill 1', [], new Date());
      }).toThrowError(new EntityError('bill: Items is required, '));
   });

   it('should change name', () => {
      const bill = new Bill('1', 'Bill 1', [makeBillItem()], new Date());
      expect(bill.name).toBe('Bill 1');
      bill.changeName('Bill 2');
      expect(bill.name).toBe('Bill 2');
   });

   it('should change description', () => {
      const bill = new Bill(
         '1',
         'Bill 1',
         [makeBillItem()],
         new Date(),
         'Description'
      );
      expect(bill.description).toBe('Description');
      bill.changeDescription('New Description');
      expect(bill.description).toBe('New Description');
   });

   it('should calculate total correctly', () => {
      const bill1 = new Bill(
         '1',
         'Bill 1',
         [makeBillItem(), makeBillItem()],
         new Date(),
         'Description'
      );
      expect(bill1.total).toBe(400);
      const bill2 = new Bill(
         '1',
         'Bill 1',
         [makeBillItem()],
         new Date(),
         'Description'
      );
      expect(bill2.total).toBe(200);
   });
});
