import ListItemUsecase from './list.usecase';
import mockRepository from '../__mocks__/repository.item.mock';
const mockItemList = [
   {
      id: 'any_id',
      name: 'Item 2',
      description: 'other_description',
      categoryId: 'other_category_id_hash',
      userId: 'any_user_id',
   },
   {
      id: 'other_id',
      name: 'Item 1',
      description: 'other_description',
      categoryId: 'other_category_id_hash',
      userId: 'any_user_id',
   },
];
describe('Item List usecase test', () => {
   it('should list items', async () => {
      const sut = new ListItemUsecase(mockRepository);
      mockRepository.findAllByUserId.mockReturnValue(mockItemList);
      const output = await sut.execute({ userId: 'any_user_id' });
      expect(output.items).toHaveLength(2);
      expect(output.items[0].id).toBe('any_id');
      expect(output.items[0].name).toBe('Item 2');
      expect(output.items[0].description).toBe('other_description');
      expect(output.items[0].categoryId).toBe('other_category_id_hash');
      expect(output.items[1].id).toBe('other_id');
      expect(output.items[1].name).toBe('Item 1');
      expect(output.items[1].description).toBe('other_description');
      expect(output.items[1].categoryId).toBe('other_category_id_hash');
   });
});
