import EntityError from '../../@shared/error/entity.error';
import BillItem from './bill-item.entity';

describe('BillItem entity unit tests', () => {
   it('should throw a error if id is empty', () => {
      expect(() => {
         const billItem = new BillItem('', 'itemId', 1, 1);
      }).toThrow(new EntityError('billItem: Id is required, '));
   });

   it('should throw a error if itemId is empty', () => {
      expect(() => {
         const billItem = new BillItem('1', '', 1, 1);
      }).toThrow(new EntityError('billItem: ItemId is required, '));
   });

   it('should throw a error if price is less or equal 0', () => {
      expect(() => {
         const billItem = new BillItem('1', 'itemId', -1, 1);
      }).toThrow(new EntityError('billItem: Price must be greater than 0, '));
   });

   it('should throw a error if quantity is less or equal 0', () => {
      expect(() => {
         const billItem = new BillItem('1', 'itemId', 1, -1);
      }).toThrow(
         new EntityError('billItem: Quantity must be greater than 0, ')
      );
   });

   it('should change price', () => {
      const billItem = new BillItem('1', 'itemId', 100, 1);
      expect(billItem.price).toBe(100);
      billItem.changePrice(250);
      expect(billItem.price).toBe(250);
   });

   it('should change quantity', () => {
      const billItem = new BillItem('1', 'itemId', 100, 2);
      expect(billItem.quantity).toBe(2);
      expect(billItem.id).toBe('1');
      billItem.changeQuantity(5);
      expect(billItem.quantity).toBe(5);
   });

   it('should calculate total', () => {
      const billItem = new BillItem('1', 'itemId', 150, 2);
      expect(billItem.total).toBe(300);
      billItem.changeQuantity(4);
      expect(billItem.total).toBe(600);
      billItem.changePrice(100);
      expect(billItem.total).toBe(400);
   });
});
