import EntityError from '@core/domain/@shared/error/entity.error';
import CreateItemUseCase from '../create.usecase';
import mockRepository from '../../__mocks__/repository.item.mock';

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
      expect(item.createdAt).toBeDefined();
      expect(item.updatedAt).toBeDefined();
   });

   it('should throw an error if required properties is not provided', async () => {
      const sut = new CreateItemUseCase(mockRepository);
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new EntityError('Item: Name is required, ')
      );
   });

   it('should throw an error if item already exists', async () => {
      const sut = new CreateItemUseCase(mockRepository);
      mockRepository.findByName.mockReturnValueOnce(
         Promise.resolve({
            id: 'any_id',
            name: 'Item 1',
            description: 'any description',
            categoryId: 'category_id_hash',
            userId: 'any_user_id',
            createdAt: new Date(),
            updatedAt: new Date(),
         })
      );
      await expect(sut.execute({ ...input, name: 'Item 1' })).rejects.toThrow(
         new EntityError('Item already exists')
      );
   });
});
