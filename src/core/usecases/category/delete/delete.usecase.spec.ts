import mockRepository from '../__mocks__/repository.category.mock';
import DeleteCategoryUseCase from './delete.usecase';

describe('Delete category usecase test', () => {
   it('should delete a category', async () => {
      const sut = new DeleteCategoryUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue({
         id: 'any_id',
         name: 'Category 1',
         description: 'any description',
      });
      mockRepository.deleteByUser = jest.fn().mockReturnValue(true);
      const result = await sut.execute({ id: 'any_id', userId: 'any_user_id' });
      expect(result).toBeFalsy();
   });

   it('should throw an error if item does not exist', async () => {
      const sut = new DeleteCategoryUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue(null);
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow('Category not found');
   });
});
