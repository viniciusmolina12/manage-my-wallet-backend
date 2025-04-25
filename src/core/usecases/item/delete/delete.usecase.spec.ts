import DeleteItemUseCase from './delete.usecase';

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

describe('Item delete usecase', () => {
   it('should delete an item', async () => {
      const sut = new DeleteItemUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue({
         id: 'any_id',
         name: 'Item 1',
         description: 'any description',
         categoryId: 'category_id_hash',
         userId: 'any_user_id',
      });
      mockRepository.deleteByUser = jest.fn().mockReturnValue(true);
      const result = await sut.execute({ id: 'any_id', userId: 'any_user_id' });
      expect(result).toBeFalsy();
   });

   it('should throw an error if item does not exist', async () => {
      const sut = new DeleteItemUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue(undefined);
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow('Item not found');
   });
});
