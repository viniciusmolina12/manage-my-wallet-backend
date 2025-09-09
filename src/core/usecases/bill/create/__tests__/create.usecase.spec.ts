import EntityError from '@core/domain/@shared/error/entity.error';
import { InputCreateBillDto } from '../create.bill.dto';
import CreateBillUseCase from '../create.usecase';
import mockItemRepository from '../../../item/__mocks__/repository.item.mock';
import mockRepository from '../../__mocks__/repository.bill.mock';
import mockVendorRepository from '../../../vendor/__mocks__/repository.vendor.mock';
import { ItemId } from '@core/domain/item/entity/item.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
mockItemRepository.findByUser.mockResolvedValue({
   id: new ItemId().id,
   name: 'any_name',
   description: 'any_description',
   userId: new UserId().id,
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
      id: new VendorId().id,
      name: 'any_vendor_name',
      userId: new UserId().id,
   });
   beforeEach(() => {
      input = {
         description: 'any_description',
         userId: new UserId().id,
         vendorId: new VendorId().id,
         name: 'any_name',
         date: new Date('2021-01-01T00:00:00.000Z'),
         items: [{ itemId: new ItemId().id, price: 10, quantity: 2 }],
      };
   });

   it('should create a bill', async () => {
      const sut = makeSut();
      const bill = await sut.execute(input);
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
