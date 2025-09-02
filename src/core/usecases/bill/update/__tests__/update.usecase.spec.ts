import EntityError from '@core/domain/@shared/error/entity.error';
import { InputUpdateBillDto } from '../update.bill.dto';
import UpdateBillUseCase from '../update.usecase';
import mockRepository from '../../__mocks__/repository.bill.mock';
import mockVendorRepository from '../../../vendor/__mocks__/repository.vendor.mock';

describe('Update bill usecase', () => {
   let input: InputUpdateBillDto;
   beforeEach(() => {
      jest.clearAllMocks;
      input = {
         id: 'any_id',
         name: 'any_name_2',
         userId: 'any_user_id',
         vendorId: 'any_vendor_id',
         description: 'any_other_description',
         date: new Date('2021-01-01T00:00:00.000Z'),
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
      };
   });
   mockVendorRepository.findByUser.mockReturnValue({
      id: 'any_vendor_id',
      name: 'any_vendor_name',
      userId: 'any_user_id',
   });

   mockRepository.findByUser.mockReturnValue({
      id: 'any_id',
      name: 'any_name',
      vendorId: 'any_vendor_id',
      description: 'any_description',
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
         {
            id: 'any_id',
            itemId: 'any_item_id',
            price: 5,
            quantity: 2,
         },
      ],
   });
   it('should update a bill', async () => {
      const sut = new UpdateBillUseCase(mockRepository, mockVendorRepository);
      const bill = await sut.execute(input);
      expect(bill.id).toBe('any_id');
      expect(bill.name).toBe('any_name_2');
      expect(bill.description).toBe('any_other_description');
      expect(bill.total).toBe(56);
      expect(bill.date).toEqual(new Date('2021-01-01T00:00:00.000Z'));
      expect(bill.items.length).toBe(2);
      expect(bill.items[0].itemId).toBe('any_other_item_id');
      expect(bill.items[0].price).toBe(10);
      expect(bill.items[0].quantity).toBe(2);
      expect(bill.items[1].itemId).toBe('any_other_item_id_2');
      expect(bill.items[1].price).toBe(12);
      expect(bill.items[1].quantity).toBe(3);
      expect(bill.createdAt).toBeDefined();
      expect(bill.updatedAt).toBeDefined();
   });

   it('should throw an error if name is empty', async () => {
      input.name = '';
      const sut = new UpdateBillUseCase(mockRepository, mockVendorRepository);
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new EntityError('bill: Name is required, ')
      );
   });

   it('should throw an error if bill does not exist', async () => {
      mockRepository.findByUser.mockReturnValueOnce(null);
      const sut = new UpdateBillUseCase(mockRepository, mockVendorRepository);
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new Error('Bill not exists')
      );
   });

   it('should throw an error if vendor does not exist', async () => {
      mockVendorRepository.findByUser.mockReturnValueOnce(null);
      const sut = new UpdateBillUseCase(mockRepository, mockVendorRepository);
      await expect(sut.execute(input)).rejects.toThrow(
         new EntityError('Vendor not exists')
      );
   });
});
