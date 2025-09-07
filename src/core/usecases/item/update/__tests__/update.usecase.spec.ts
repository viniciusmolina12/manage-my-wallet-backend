import EntityError from '@core/domain/@shared/error/entity.error';
import UpdateItemUseCase from '../update.usecase';
import mockRepository from '../../__mocks__/repository.item.mock';
import { ItemId } from '@core/domain/item/entity/item.entity';

const input = {
   id: new ItemId().id,
   name: 'Item 1',
   description: 'any description',
   categoryId: 'category_id_hash',
   userId: 'any_user_id',
};
describe('Item update usecase test', () => {
   it('should update an item', async () => {
      const sut = new UpdateItemUseCase(mockRepository);
      const id = new ItemId();
      mockRepository.findByUser = jest.fn().mockReturnValue({
         id: id.id,
         name: 'Item 2',
         description: 'other_description',
         categoryId: 'other_category_id_hash',
         userId: 'any_user_id',
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      const item = await sut.execute(input);
      expect(item.name).toBe(input.name);
      expect(item.description).toBe(input.description);
      expect(item.categoryId).toBe(input.categoryId);
      expect(item.createdAt).toBeDefined();
      expect(item.updatedAt).toBeDefined();
   });
   it('should throw an error if item does not exist', async () => {
      const sut = new UpdateItemUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue(undefined);
      await expect(sut.execute(input)).rejects.toThrow('Item not found');
   });

   it('should throw an error if required properties is not provided', async () => {
      const sut = new UpdateItemUseCase(mockRepository);
      const id = new ItemId();
      mockRepository.findByUser.mockReturnValue({
         id: id.id,
         name: 'Item 2',
         description: 'other_description',
         userId: 'any_user_id',
         categoryId: 'other_category_id_hash',
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new EntityError('Item: Name is required, ')
      );
   });
});
