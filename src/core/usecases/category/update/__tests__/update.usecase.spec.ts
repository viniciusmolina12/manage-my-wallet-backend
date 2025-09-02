import mockRepository from '../__mocks__/repository.category.mock';
import UpdateCategoryUseCase from './update.usecase';

describe('Update category usecase', () => {
   it('should be able to update a new category', async () => {
      const sut = new UpdateCategoryUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValueOnce({
         id: 'any_id',
         name: 'any_name',
         userId: 'any_user_id',
         description: 'any_description',
      });
      const input = {
         id: 'any_id',
         name: 'any_name',
         description: 'any_description',
         userId: 'any_user_id',
      };
      const category = await sut.execute(input);
      expect(category).toBeTruthy();
      expect(category.name).toBe(input.name);
      expect(category.description).toBe(input.description);
   });

   it('should throw an error if category already exists', async () => {
      const sut = new UpdateCategoryUseCase(mockRepository);
      const input = {
         id: 'any_id',
         name: 'any_name',
         description: 'any_description',
         userId: 'any_user_id',
      };
      mockRepository.findCategoryByName.mockReturnValueOnce(
         Promise.resolve(true)
      );
      expect(sut.execute(input)).rejects.toThrow('Category already exists');
   });

   it('should throw an error if name is not provided', async () => {
      const sut = new UpdateCategoryUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValueOnce({
         id: 'any_id',
         name: 'any_name',
         description: 'any_description',
      });
      const input = {
         id: 'any_id',
         name: '',
         description: 'any_description',
         userId: 'any_user_id',
      };
      expect(sut.execute(input)).rejects.toThrow('category: Name is required');
   });
});
