import CreateCategoryUseCase from '../create.usecase';
import mockRepository from '../../__mocks__/repository.category.mock';

describe('Create category usecase', () => {
   it('should be able to create a new category', async () => {
      const sut = new CreateCategoryUseCase(mockRepository);
      const input = {
         name: 'any_name',
         description: 'any_description',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      };
      const category = await sut.execute(input);
      expect(category).toBeTruthy();
      expect(category.id).toBeTruthy();
      expect(category.name).toBe(input.name);
      expect(category.description).toBe(input.description);
   });

   it('should throw an error if category already exists', async () => {
      const sut = new CreateCategoryUseCase(mockRepository);
      const input = {
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
      const sut = new CreateCategoryUseCase(mockRepository);
      const input = {
         name: '',
         description: 'any_description',
         userId: '123e4567-e89b-12d3-a456-426614174000',
      };
      expect(sut.execute(input)).rejects.toThrow('category: Name is required');
   });
});
