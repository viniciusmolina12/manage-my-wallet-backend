import ListBillUseCase from './list.usecase';
import mockRepository from '../__mocks__/repository.bill.mock';

describe('List bill usecase', () => {
   it('should list all bills', async () => {
      mockRepository.findAllByUser.mockReturnValueOnce([
         {
            id: 'any_id',
            name: 'any_name',
            vendorId: 'any_vendor_id',
            description: 'any_description',
            total: 56,
            userId: 'any_user_id',
            items: [
               {
                  id: 'any_id',
                  itemId: 'any_other_item_id',
                  price: 10,
                  quantity: 2,
               },
               {
                  id: 'any_other_2_id_2',
                  itemId: 'any_other_item_id_2',
                  price: 12,
                  quantity: 3,
               },
            ],
         },
         {
            id: 'any_id',
            name: 'any_name_2',
            vendorId: 'any_vendor_id',
            description: 'any_other_description',
            total: 20,
            userId: 'any_user_id',
            items: [
               {
                  id: 'any_id',
                  itemId: 'any_item_id',
                  price: 10,
                  quantity: 2,
               },
            ],
         },
      ]);
      const sut = new ListBillUseCase(mockRepository);
      const response = await sut.execute({ userId: 'any_user_id' });
      expect(response.bills.length).toBe(2);
      expect(response.bills[0].id).toBe('any_id');
      expect(response.bills[0].name).toBe('any_name');
      expect(response.bills[0].description).toBe('any_description');
      expect(response.bills[0].total).toBe(56);
      expect(response.bills[0].vendorId).toBe('any_vendor_id');
      expect(response.bills[0].items.length).toBe(2);
      expect(response.bills[1].id).toBe('any_id');
      expect(response.bills[1].name).toBe('any_name_2');
      expect(response.bills[1].description).toBe('any_other_description');
      expect(response.bills[1].total).toBe(20);
      expect(response.bills[1].vendorId).toBe('any_vendor_id');
      expect(response.bills[1].items.length).toBe(1);
   });
});
