import { UserId } from '@core/domain/user/entity/user.entity';
import EntityError from '../../../@shared/error/entity.error';
import Category, { CategoryId } from '../category.entity';

describe('Category entity tests', () => {
   it('Should create a category', () => {
      const id = new CategoryId();
      const category = new Category(
         id,
         'Category',
         new UserId(),
         'Description'
      );
      expect(category.id).toBe(id);
      expect(category.name).toBe('Category');
      expect(category.description).toBe('Description');
   });
   it('Should throw an error if id is missing', () => {
      expect(() => {
         const category = new Category(
            null as any,
            'Category',
            new UserId(),
            'Description'
         );
      }).toThrow(new EntityError('category: Id is required, '));
   });
   it('Should throw an error if name is missing', () => {
      expect(() => {
         const category = new Category(
            new CategoryId(),
            '',
            new UserId(),
            'Description'
         );
      }).toThrow(new EntityError('category: Name is required, '));
   });
   it('Should throw an error if user is missing', () => {
      expect(() => {
         const category = new Category(
            new CategoryId(),
            'Category',
            '' as any,
            'Description'
         );
      }).toThrow(new EntityError('category: User is required, '));
   });
});
