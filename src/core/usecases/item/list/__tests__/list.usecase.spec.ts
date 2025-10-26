import ListItemUsecase from '../list.usecase';
import mockRepository from '../../__mocks__/repository.item.mock';
import { Filter } from '@core/domain/@shared/filter/filter';

const mockItemList = [
   {
      id: 'any_id',
      name: 'Item 2',
      description: 'other_description',
      categoryId: 'other_category_id_hash',
      userId: 'any_user_id',
      createdAt: new Date(),
      updatedAt: new Date(),
   },
   {
      id: 'other_id',
      name: 'Item 1',
      description: 'other_description',
      categoryId: 'other_category_id_hash',
      userId: 'any_user_id',
      createdAt: new Date(),
      updatedAt: new Date(),
   },
];

const mockPagination = {
   page: 1,
   perPage: 10,
   total: 2,
   hasNext: false,
   data: mockItemList,
};

describe('Item List usecase test', () => {
   it('should list items', async () => {
      const sut = new ListItemUsecase(mockRepository);
      mockRepository.findAllByUser.mockReturnValue(mockPagination);
      const filter = new Filter(1, 10, 'asc', { name: 'test' });
      const output = await sut.execute({ userId: 'any_user_id' }, filter);
      expect(output.items).toHaveLength(2);
      expect(output.items[0].id).toBe('any_id');
      expect(output.items[0].name).toBe('Item 2');
      expect(output.items[0].description).toBe('other_description');
      expect(output.items[0].categoryId).toBe('other_category_id_hash');
      expect(output.items[1].id).toBe('other_id');
      expect(output.items[1].name).toBe('Item 1');
      expect(output.items[1].description).toBe('other_description');
      expect(output.items[1].categoryId).toBe('other_category_id_hash');
      expect(output.meta).toEqual({
         page: 1,
         perPage: 10,
         total: 2,
         hasNext: false,
      });
   });
});
