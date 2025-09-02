import mockRepository from '../../__mocks__/repository.category.mock';
import FindCategoryUseCase from '../find.usecase';
describe('Find category usecase test', () => {
   it('should throw an error if category does not exist', async () => {
      const sut = new FindCategoryUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValueOnce(Promise.resolve(null));
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow('Category not found');
   });

   it('should return a category if category exists', async () => {
      const sut = new FindCategoryUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValueOnce(
         Promise.resolve({
            id: 'any_id',
            name: 'any_name',
            description: 'any_description',
         })
      );
      const category = await sut.execute({
         id: 'any_id',
         userId: 'any_user_id',
      });
      expect(category).toEqual({
         id: 'any_id',
         name: 'any_name',
         description: 'any_description',
      });
   });
});
