import FindItemUseCase from './find.usecase';

const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
};
describe('Find item create usecase test', () => {
   it('should find an item', async () => {
      const sut = new FindItemUseCase(mockRepository);
      mockRepository.find = jest.fn().mockReturnValue({
         id: 'any_id',
         name: 'Item 2',
         description: 'other_description',
         categoryId: 'other_category_id_hash',
      });
      const item = await sut.execute({ id: 'any_id' });
   });
   it('should throw an error if item does not exist', async () => {
      const sut = new FindItemUseCase(mockRepository);
      mockRepository.find = jest.fn().mockReturnValue(undefined);
      await expect(sut.execute({ id: 'any_id' })).rejects.toThrow(
         'Item not found'
      );
   });
});
