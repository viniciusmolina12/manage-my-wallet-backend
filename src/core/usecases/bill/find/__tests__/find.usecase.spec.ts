import FindBillUseCase from '../find.usecase';
import mockRepository from '../../__mocks__/repository.bill.mock';
import mockItemRepository from '../../../item/__mocks__/repository.item.mock';
import mockVendorRepository from '../../../vendor/__mocks__/repository.vendor.mock';
import mockCategoryRepository from '../../../category/__mocks__/repository.category.mock';
describe('Find bill usecase', () => {
   it('should find a bill', async () => {
      mockRepository.findByUser.mockReturnValueOnce({
         id: 'any_id',
         name: 'any_name_2',
         description: 'any_other_description',
         userId: { id: 'any_user_id' },
         total: 56,
         vendorId: { id: 'any_vendor_id' },
         date: new Date('2021-01-01T00:00:00.000Z'),
         createdAt: new Date(),
         updatedAt: new Date(),
         items: [
            {
               itemId: { id: 'any_other_item_id' },
               price: 10,
               quantity: 2,
            },
            {
               itemId: { id: 'any_other_item_id' },
               price: 12,
               quantity: 3,
            },
         ],
      });
      mockItemRepository.findItemsByIds.mockReturnValueOnce([
         {
            id: 'any_other_item_id',
            name: 'any_other_item_name',
            description: 'any_other_item_description',
            categoryId: 'any_other_category_id',
         },
      ]);
      mockCategoryRepository.findCategoriesByIds.mockReturnValueOnce([
         {
            id: { id: 'any_other_category_id' },
            name: 'any_other_category_name',
         },
      ]);
      mockVendorRepository.findByUser.mockReturnValueOnce({
         id: 'any_vendor_id',
         name: 'any_vendor_name',
      });
      const sut = new FindBillUseCase(
         mockRepository,
         mockItemRepository,
         mockVendorRepository,
         mockCategoryRepository
      );
      const bill = await sut.execute({ id: 'any_id', userId: 'any_user_id' });
      expect(bill.id).toBe('any_id');
      expect(bill.name).toBe('any_name_2');
      expect(bill.description).toBe('any_other_description');
      expect(bill.total).toBe(56);
      expect(bill.vendorId).toBe('any_vendor_id');
      expect(bill.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(bill.vendorName).toBe('any_vendor_name');
      expect(bill.items[0].id).toBe('any_other_item_id');
      expect(bill.items[0].name).toBe('any_other_item_name');
      expect(bill.items[0].description).toBe('any_other_item_description');
      expect(bill.items[0].price).toBe(10);
      expect(bill.items[0].quantity).toBe(2);
      expect(bill.items[0].categoryId).toBe('any_other_category_id');
      expect(bill.items[0].categoryName).toBe('any_other_category_name');
      expect(bill.items.length).toBe(2);
      expect(bill.createdAt).toBeDefined();
      expect(bill.updatedAt).toBeDefined();
   });

   it('should throw an error if bill not found', async () => {
      const sut = new FindBillUseCase(
         mockRepository,
         mockItemRepository,
         mockVendorRepository,
         mockCategoryRepository
      );
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow(new Error('Bill not found'));
   });
});
