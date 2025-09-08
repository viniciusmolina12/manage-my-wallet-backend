import { UserId } from '@core/domain/user/entity/user.entity';
import EntityError from '../../../@shared/error/entity.error';
import Item, { ItemId } from '../item.entity';
import { CategoryId } from '@core/domain/category/entity/category.entity';

describe('Item entity tests', () => {
   it('Should create an item', () => {
      const categoryId = new CategoryId();
      const id = new ItemId();
      const item = new Item(
         id,
         'Item 1',
         categoryId,
         new UserId(),
         'Description'
      );
      expect(item.id).toBe(id.id);
      expect(item.name).toBe('Item 1');
      expect(item.categoryId).toBe(categoryId.id);
      expect(item.description).toBe('Description');
   });
   it('Should throw an error if id is not valid', () => {
      expect(() => {
         const item = new Item(
            new ItemId('invalid_uuid'),
            'Item 1',
            new CategoryId(),
            new UserId()
         );
      }).toThrow(new EntityError('Invalid UUID'));
   });
   it('Should throw an error if name is missing', () => {
      expect(() => {
         const item = new Item(
            new ItemId(),
            '',
            new CategoryId(),
            new UserId()
         );
      }).toThrow(new EntityError('Item: Name is required, '));
   });
   it('Should throw an error if categoryId is missing', () => {
      expect(() => {
         const item = new Item(new ItemId(), 'Item 1', '' as any, new UserId());
      }).toThrow(new EntityError('Item: Category is required, '));
   });
   it('Should throw an error if userId is missing', () => {
      expect(() => {
         const item = new Item(
            new ItemId(),
            'Item 1',
            new CategoryId(),
            '' as any
         );
      }).toThrow(new EntityError('Item: User is required, '));
   });
});
