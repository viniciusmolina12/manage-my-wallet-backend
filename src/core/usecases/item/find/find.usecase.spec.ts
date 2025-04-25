import FindItemUseCase from './find.usecase';

const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
   findByUser: jest.fn(),
   findAllByUserId: jest.fn(),
   deleteByUser: jest.fn(),
};
describe('Find item create usecase test', () => {
   it('should find an item', async () => {
      const sut = new FindItemUseCase(mockRepository);
      mockRepository.findByUser = jest.fn().mockReturnValue({
         id: 'any_id',
         name: 'Item 2',
         description: 'other_description',
         categoryId: 'other_category_id_hash',
         userId: 'any_user_id',
      });
      const item = await sut.execute({ id: 'any_id', userId: 'any_user_id' });
      expect(item.id).toBe('any_id');
      expect(item.name).toBe('Item 2');
      expect(item.description).toBe('other_description');
      expect(item.categoryId).toBe('other_category_id_hash');
   });
   it('should throw an error if item does not exist', async () => {
      const sut = new FindItemUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue(undefined);
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow('Item not found');
   });
});
