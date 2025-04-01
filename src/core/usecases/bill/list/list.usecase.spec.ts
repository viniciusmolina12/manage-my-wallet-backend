import ListBillUseCase from './list.usecase';

const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
};

describe('List bill usecase', () => {
   it('should list all bills', async () => {
      mockRepository.findAll.mockReturnValueOnce([
         {
            id: 'any_id',
            name: 'any_name',
            description: 'any_description',
            total: 56,
            createdDate: new Date('2020-02-10 10:20:30'),
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
            description: 'any_other_description',
            total: 20,
            createdDate: new Date('2020-02-10 10:20:30'),
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
      const response = await sut.execute({});
      expect(response.bills.length).toBe(2);
      expect(response.bills[0].id).toBe('any_id');
      expect(response.bills[0].name).toBe('any_name');
      expect(response.bills[0].description).toBe('any_description');
      expect(response.bills[0].total).toBe(56);
      expect(response.bills[0].createdDate).toBeInstanceOf(Date);
      expect(response.bills[0].items.length).toBe(2);
      expect(response.bills[1].id).toBe('any_id');
      expect(response.bills[1].name).toBe('any_name_2');
      expect(response.bills[1].description).toBe('any_other_description');
      expect(response.bills[1].total).toBe(20);
      expect(response.bills[1].createdDate).toBeInstanceOf(Date);
      expect(response.bills[1].items.length).toBe(1);
   });
});
