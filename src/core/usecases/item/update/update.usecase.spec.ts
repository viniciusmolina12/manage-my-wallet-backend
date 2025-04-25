import EntityError from '@core/domain/@shared/error/entity.error';
import UpdateItemUseCase from './update.usecase';

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
   id: 'any_id',
   name: 'Item 1',
   description: 'any description',
   categoryId: 'category_id_hash',
   userId: 'any_user_id',
};
describe('Item update usecase test', () => {
   it('should update an item', async () => {
      const sut = new UpdateItemUseCase(mockRepository);
      mockRepository.findByUser = jest.fn().mockReturnValue({
         id: 'any_id',
         name: 'Item 2',
         description: 'other_description',
         categoryId: 'other_category_id_hash',
         userId: 'any_user_id',
      });
      const item = await sut.execute(input);
      expect(item.name).toBe(input.name);
      expect(item.description).toBe(input.description);
      expect(item.categoryId).toBe(input.categoryId);
   });
   it('should throw an error if item does not exist', async () => {
      const sut = new UpdateItemUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue(undefined);
      await expect(sut.execute(input)).rejects.toThrow('Item not found');
   });

   it('should throw an error if required properties is not provided', async () => {
      const sut = new UpdateItemUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue({
         id: 'any_id',
         name: 'Item 2',
         description: 'other_description',
         userId: 'any_user_id',
         categoryId: 'other_category_id_hash',
      });
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new EntityError('Item: Name is required, ')
      );
   });
});
