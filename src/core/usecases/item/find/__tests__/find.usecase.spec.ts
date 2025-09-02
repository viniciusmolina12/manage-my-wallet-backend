import mockRepository from '../../__mocks__/repository.item.mock';
import FindItemUseCase from '../find.usecase';

describe('Find item create usecase test', () => {
   it('should find an item', async () => {
      const sut = new FindItemUseCase(mockRepository);
      mockRepository.findByUser = jest.fn().mockReturnValue({
         id: 'any_id',
         name: 'Item 2',
         description: 'other_description',
         categoryId: 'other_category_id_hash',
         userId: 'any_user_id',
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      const item = await sut.execute({ id: 'any_id', userId: 'any_user_id' });
      expect(item.id).toBe('any_id');
      expect(item.name).toBe('Item 2');
      expect(item.description).toBe('other_description');
      expect(item.categoryId).toBe('other_category_id_hash');
      expect(item.createdAt).toBeDefined();
      expect(item.updatedAt).toBeDefined();
   });
   it('should throw an error if item does not exist', async () => {
      const sut = new FindItemUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue(undefined);
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow('Item not found');
   });
});
