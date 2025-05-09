import FindBillUseCase from './find.usecase';
import mockRepository from '../__mocks__/repository.bill.mock';
describe('Find bill usecase', () => {
   it('should find a bill', async () => {
      mockRepository.findByUser.mockReturnValueOnce({
         id: 'any_id',
         name: 'any_name_2',
         description: 'any_other_description',
         userId: 'any_user_id',
         total: 56,
         vendorId: 'any_vendor_id',
         date: new Date('2021-01-01T00:00:00.000Z'),
         createdAt: new Date(),
         updatedAt: new Date(),
         items: [
            {
               id: 'any_other_id',
               itemId: 'any_other_item_id',
               price: 10,
               quantity: 2,
            },
            {
               id: 'any_other_id_2',
               itemId: 'any_other_item_id_2',
               price: 12,
               quantity: 3,
            },
         ],
      });
      const sut = new FindBillUseCase(mockRepository);
      const bill = await sut.execute({ id: 'any_id', userId: 'any_user_id' });
      expect(bill.id).toBe('any_id');
      expect(bill.name).toBe('any_name_2');
      expect(bill.description).toBe('any_other_description');
      expect(bill.total).toBe(56);
      expect(bill.vendorId).toBe('any_vendor_id');
      expect(bill.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(bill.items.length).toBe(2);
      expect(bill.createdAt).toBeDefined();
      expect(bill.updatedAt).toBeDefined();
   });

   it('should throw an error if bill not found', async () => {
      const sut = new FindBillUseCase(mockRepository);
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow(new Error('Bill not found'));
   });
});
