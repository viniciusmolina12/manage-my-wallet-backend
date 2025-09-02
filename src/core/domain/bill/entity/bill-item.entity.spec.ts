import Item from '@core/domain/item/entity/item.entity';
import EntityError from '../../@shared/error/entity.error';
import BillItem from './bill-item.entity';

describe('BillItem entity unit tests', () => {
   it('should throw a error if id is empty', () => {
      expect(() => {
         const item = new Item(
            '1',
            'itemName',
            'itemDescription',
            'itemCategoryId',
            'itemUserId'
         );
         const billItem = new BillItem('', item, 1, 1);
      }).toThrow(new EntityError('billItem: Id is required, '));
   });

   it('should throw a error if price is less or equal 0', () => {
      expect(() => {
         const item = new Item(
            '1',
            'itemName',
            'itemDescription',
            'itemCategoryId',
            'itemUserId'
         );
         const billItem = new BillItem('1', item, -1, 1);
      }).toThrow(new EntityError('billItem: Price must be greater than 0, '));
   });

   it('should throw a error if quantity is less or equal 0', () => {
      expect(() => {
         const item = new Item(
            '1',
            'itemName',
            'itemDescription',
            'itemCategoryId',
            'itemUserId'
         );
         const billItem = new BillItem('1', item, 1, -1);
      }).toThrow(
         new EntityError('billItem: Quantity must be greater than 0, ')
      );
   });

   it('should change price', () => {
      const item = new Item(
         '1',
         'itemName',
         'itemDescription',
         'itemCategoryId',
         'itemUserId'
      );
      const billItem = new BillItem('1', item, 100, 1);
      expect(billItem.price).toBe(100);
      billItem.changePrice(250);
      expect(billItem.price).toBe(250);
   });

   it('should change quantity', () => {
      const item = new Item(
         '1',
         'itemName',
         'itemDescription',
         'itemCategoryId',
         'itemUserId'
      );
      const billItem = new BillItem('1', item, 100, 2);
      expect(billItem.quantity).toBe(2);
      expect(billItem.id).toBe('1');
      billItem.changeQuantity(5);
      expect(billItem.quantity).toBe(5);
   });

   it('should calculate total', () => {
      const item = new Item(
         '1',
         'itemName',
         'itemDescription',
         'itemCategoryId',
         'itemUserId'
      );
      const billItem = new BillItem('1', item, 150, 2);
      expect(billItem.total).toBe(300);
      expect(billItem.item.name).toBe('itemName');
      expect(billItem.item.description).toBe('itemDescription');
      expect(billItem.item.categoryId).toBe('itemCategoryId');
      expect(billItem.item.userId).toBe('itemUserId');
      billItem.changeQuantity(4);
      expect(billItem.total).toBe(600);
      billItem.changePrice(100);
      expect(billItem.total).toBe(400);
   });
});
