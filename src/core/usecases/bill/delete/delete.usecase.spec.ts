import mockRepository from '../__mocks__/repository.bill.mock';
import DeleteBillUseCase from './delete.usecase';

describe('Delete bill usecase test', () => {
   it('should delete a bill', async () => {
      const sut = new DeleteBillUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue({
         description: 'any_description',
         vendorId: 'any_vendor_id',
         name: 'any_name',
         items: [
            {
               itemId: 'any_item_id',
               price: 10,
               quantity: 2,
            },
         ],
      });
      mockRepository.delete = jest.fn().mockReturnValue(true);
      const result = await sut.execute({ id: 'any_id', userId: 'any_user_id' });
      expect(result).toBeFalsy();
   });

   it('should throw an error if bill does not exist', async () => {
      const sut = new DeleteBillUseCase(mockRepository);
      mockRepository.findByUser.mockReturnValue(undefined);
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow('Bill not found');
   });
});
