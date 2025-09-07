import EntityError from '../../../@shared/error/entity.error';
import Item, { ItemId } from '../item.entity';

describe('Item entity tests', () => {
   it('Should create an item', () => {
      const id = new ItemId();
      const item = new Item(id, 'Item 1', '1', 'any_user_id', 'Description');
      expect(item.id).toBe(id.id);
      expect(item.name).toBe('Item 1');
      expect(item.categoryId).toBe('1');
      expect(item.description).toBe('Description');
   });
   it('Should throw an error if id is not valid', () => {
      expect(() => {
         const item = new Item(
            new ItemId('invalid_uuid'),
            'Item 1',
            '1',
            'any_user_id'
         );
      }).toThrow(new EntityError('Invalid UUID'));
   });
   it('Should throw an error if name is missing', () => {
      expect(() => {
         const item = new Item(new ItemId(), '', '1', 'any_user_id');
      }).toThrow(new EntityError('Item: Name is required, '));
   });
   it('Should throw an error if categoryId is missing', () => {
      expect(() => {
         const item = new Item(new ItemId(), 'Item 1', '', 'any_user_id');
      }).toThrow(new EntityError('Item: Category is required, '));
   });
   it('Should throw an error if userId is missing', () => {
      expect(() => {
         const item = new Item(new ItemId(), 'Item 1', '1', '');
      }).toThrow(new EntityError('Item: User is required, '));
   });
});
