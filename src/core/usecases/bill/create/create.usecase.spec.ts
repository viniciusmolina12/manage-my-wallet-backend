import EntityError from '@core/domain/@shared/error/entity.error';
import { InputCreateBillDto } from './create.bill.dto';
import CreateBillUseCase from './create.usecase';
import mockItemRepository from '../../item/__mocks__/repository.item.mock';
import mockRepository from '../__mocks__/repository.bill.mock';
import mockVendorRepository from '../../vendor/__mocks__/repository.vendor.mock';
mockItemRepository.findByUser.mockResolvedValue({
   id: 'any_item_id',
   name: 'any_name',
   description: 'any_description',
   userId: 'any_user_id',
});

const makeSut = () => {
   return new CreateBillUseCase(
      mockRepository,
      mockItemRepository,
      mockVendorRepository
   );
};

let input: InputCreateBillDto;

describe('Create bill usecase', () => {
   mockVendorRepository.findByUser.mockResolvedValue({
      id: 'any_vendor_id',
      name: 'any_vendor_name',
      userId: 'any_user_id',
   });
   beforeEach(() => {
      input = {
         description: 'any_description',
         userId: 'any_user_id',
         vendorId: 'any_vendor_id',
         name: 'any_name',
         items: [{ itemId: 'any_item_id', price: 10, quantity: 2 }],
      };
   });

   it('should create a bill', async () => {
      const sut = makeSut();
      const bill = await sut.execute(input);
      expect(bill.name).toBe('any_name');
      expect(bill.total).toBe(20);
      expect(bill.description).toBe('any_description');
      expect(bill.items.length).toBe(1);
      expect(bill.items[0].itemId).toBe('any_item_id');
      expect(bill.items[0].price).toBe(10);
      expect(bill.items[0].quantity).toBe(2);
   });

   it('should throw an error if name is empty', async () => {
      const sut = makeSut();
      input.name = '';
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new EntityError('bill: Name is required, ')
      );
   });

   it('should throw an error if item is not found', async () => {
      mockItemRepository.findByUser.mockResolvedValue(null);
      const sut = makeSut();
      await expect(sut.execute(input)).rejects.toThrow(
         new EntityError('Item not found')
      );
   });

   it('should throw an error if vendor is not found', async () => {
      mockVendorRepository.findByUser.mockResolvedValue(null);
      const sut = makeSut();
      await expect(sut.execute(input)).rejects.toThrow(
         new EntityError('Vendor not found')
      );
   });
});
