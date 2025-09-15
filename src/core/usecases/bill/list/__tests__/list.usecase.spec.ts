import ListBillUseCase from '../list.usecase';
import mockRepository from '../../__mocks__/repository.bill.mock';
import { Filter, Pagination } from '@core/domain/@shared/filter/filter';

describe('List bill usecase', () => {
   it('should list all bills', async () => {
      mockRepository.findAllByUser.mockReturnValueOnce(
         new Pagination(1, 10, 2, true, [
            {
               id: '123e4567-e89b-12d3-a456-426614174000',
               name: 'any_name',
               vendorId: { id: '123e4567-e89b-12d3-a456-426614174000' },
               description: 'any_description',
               total: 56,
               userId: '123e4567-e89b-12d3-a456-426614174000',
               date: new Date('2021-01-01T00:00:00.000Z'),
               createdAt: new Date(),
               updatedAt: new Date(),
               items: [
                  {
                     id: '123e4567-e89b-12d3-a456-426614174000',
                     itemId: 'any_other_item_id',
                     price: 10,
                     quantity: 2,
                  },
                  {
                     id: '123e4567-e89b-12d3-a456-426614174001',
                     itemId: 'any_other_item_id_2',
                     price: 12,
                     quantity: 3,
                  },
               ],
            },
            {
               id: '123e4567-e89b-12d3-a456-426614174000',
               name: 'any_name_2',
               vendorId: { id: '123e4567-e89b-12d3-a456-426614174000' },
               description: 'any_other_description',
               total: 20,
               userId: '123e4567-e89b-12d3-a456-426614174000',
               date: new Date('2021-01-01T00:00:00.000Z'),
               createdAt: new Date(),
               updatedAt: new Date(),
               items: [
                  {
                     id: '123e4567-e89b-12d3-a456-426614174000',
                     itemId: 'any_item_id',
                     price: 10,
                     quantity: 2,
                  },
               ],
            },
         ])
      );
      const sut = new ListBillUseCase(mockRepository);
      const filter = new Filter(1, 10, 'asc', {
         name: 'any_name',
         vendorId: '123e4567-e89b-12d3-a456-426614174000',
         startDate: new Date('2021-01-01T00:00:00.000Z'),
         endDate: new Date('2021-01-01T00:00:00.000Z'),
      });
      const response = await sut.execute(
         { userId: '123e4567-e89b-12d3-a456-426614174000' },
         filter
      );
      expect(response.bills.length).toBe(2);
      expect(response.bills[0].id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(response.bills[0].name).toBe('any_name');
      expect(response.bills[0].description).toBe('any_description');
      expect(response.bills[0].total).toBe(56);
      expect(response.bills[0].vendorId).toBe(
         '123e4567-e89b-12d3-a456-426614174000'
      );
      expect(response.bills[0].date).toEqual(
         new Date('2021-01-01T00:00:00.000Z')
      );
      expect(response.bills[0].items.length).toBe(2);
      expect(response.bills[0].createdAt).toBeDefined();
      expect(response.bills[0].updatedAt).toBeDefined();
      expect(response.bills[1].id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(response.bills[1].name).toBe('any_name_2');
      expect(response.bills[1].description).toBe('any_other_description');
      expect(response.bills[1].total).toBe(20);
      expect(response.bills[1].vendorId).toBe(
         '123e4567-e89b-12d3-a456-426614174000'
      );
      expect(response.bills[1].date).toEqual(
         new Date('2021-01-01T00:00:00.000Z')
      );
      expect(response.bills[1].items.length).toBe(1);
      expect(response.bills[1].createdAt).toBeDefined();
      expect(response.bills[1].updatedAt).toBeDefined();
   });
});
