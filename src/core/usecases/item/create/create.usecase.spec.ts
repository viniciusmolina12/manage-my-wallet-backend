import EntityError from '@core/domain/@shared/error/entity.error';
import CreateItemUseCase from './create.usecase';
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

const input = {
   name: 'Item 1',
   description: 'any description',
   categoryId: 'category_id_hash',
   userId: 'any_user_id',
};
describe('Item create usecase test', () => {
   it('should create an item', async () => {
      const sut = new CreateItemUseCase(mockRepository);
      const item = await sut.execute(input);
      expect(item.name).toBe(input.name);
      expect(item.description).toBe(input.description);
      expect(item.categoryId).toBe(input.categoryId);
   });

   it('should throw an error if required properties is not provided', async () => {
      const sut = new CreateItemUseCase(mockRepository);
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new EntityError('Item: Name is required, ')
      );
   });
});
