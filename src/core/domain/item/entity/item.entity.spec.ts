import EntityError from '../../@shared/error/entity.error';
import Item from './item.entity';

describe('Item entity tests', () => {
   it('Should create an item', () => {
      const item = new Item('123', 'Item 1', '1', 'Description');
      expect(item.id).toBe('123');
      expect(item.name).toBe('Item 1');
      expect(item.categoryId).toBe('1');
      expect(item.description).toBe('Description');
   });
   it('Should throw an error if id is missing', () => {
      expect(() => {
         const item = new Item('', 'Item 1', '1', 'Description');
      }).toThrow(new EntityError('Item: Id is required, '));
   });
   it('Should throw an error if name is missing', () => {
      expect(() => {
         const item = new Item('1', '', '1', 'Description');
      }).toThrow(new EntityError('Item: Name is required, '));
   });
   it('Should throw an error if categoryId is missing', () => {
      expect(() => {
         const item = new Item('1', 'Item 1', '', 'Description');
      }).toThrow(new EntityError('Item: Category is required, '));
   });
});
