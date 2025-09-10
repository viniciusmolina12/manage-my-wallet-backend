import mockRepository from '../../__mocks__/repository.category.mock';
import UpdateCategoryUseCase from '../update.usecase';

describe('Update category usecase', () => {
   it('should be able to update a new category', async () => {
      const sut = new UpdateCategoryUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValueOnce({
         id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'any_name',
         userId: '123e4567-e89b-12d3-a456-426614174000',
         description: 'any_description',
      });
      const input = {
         id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'any_name',
         description: 'any_description',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      };
      const category = await sut.execute(input);
      expect(category).toBeTruthy();
      expect(category.name).toBe(input.name);
      expect(category.description).toBe(input.description);
   });

   it('should throw an error if category already exists', async () => {
      const sut = new UpdateCategoryUseCase(mockRepository);
      const input = {
         id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'any_name',
         description: 'any_description',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      };
      mockRepository.findCategoryByName.mockReturnValueOnce(
         Promise.resolve(true)
      );
      expect(sut.execute(input)).rejects.toThrow('Category already exists');
   });

   it('should throw an error if name is not provided', async () => {
      const sut = new UpdateCategoryUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValueOnce({
         id: '123e4567-e89b-12d3-a456-426614174000',
         name: 'any_name',
         description: 'any_description',
      });
      const input = {
         id: '123e4567-e89b-12d3-a456-426614174000',
         name: '',
         description: 'any_description',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      };
      expect(sut.execute(input)).rejects.toThrow('category: Name is required');
   });
});
