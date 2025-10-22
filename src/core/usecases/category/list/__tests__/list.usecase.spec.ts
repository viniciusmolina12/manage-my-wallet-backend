import ListCategoryUseCase from '../list.usecase';
import mockRepository from '../../__mocks__/repository.category.mock';
import { Filter, Pagination } from '@core/domain/@shared/filter/filter';

describe('List category usecase test', () => {
   it('should list all categories', async () => {
      const sut = new ListCategoryUseCase(mockRepository);
      mockRepository.findAllByUser.mockReturnValueOnce(
         new Pagination(1, 10, 2, true, [
            {
               id: 'category_id_1',
               name: 'category_1',
               description: 'category_description_1',
            },
            {
               id: 'category_id_2',
               name: 'category_2',
               description: 'category_description_2',
            },
         ])
      );
      const mockSpy = jest.spyOn(mockRepository, 'findAllByUser');
      const filter = new Filter(1, 10, 'asc', {});
      const response = await sut.execute({ userId: 'any_user_id' }, filter);
      expect(mockSpy).toHaveBeenCalledWith('any_user_id', filter);
      expect(response).toBeTruthy();
      expect(response.categories.length).toBe(2);
      expect(response.categories[0].id).toBe('category_id_1');
      expect(response.categories[0].name).toBe('category_1');
      expect(response.categories[0].description).toBe('category_description_1');
      expect(response.categories[1].id).toBe('category_id_2');
      expect(response.categories[1].name).toBe('category_2');
      expect(response.categories[1].description).toBe('category_description_2');
   });
});
