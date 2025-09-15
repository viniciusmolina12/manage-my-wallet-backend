import Vendor, { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import mockRepository from '../../__mocks__/repository.vendor.mock';
import { UpdateVendorUseCase } from '../update.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
import { UserId } from '@core/domain/user/entity/user.entity';
interface SutTypes {
   sut: UpdateVendorUseCase;
}

const makeSut = (): SutTypes => {
   const sut = new UpdateVendorUseCase(mockRepository as any);
   return { sut };
};

describe('UpdateVendorUseCase', () => {
   it('should call update with correct values', async () => {
      const { sut } = makeSut();
      const updatedVendor = new Vendor(
         new VendorId(),
         'any_older_name',
         new UserId()
      );
      mockRepository.findByUser.mockResolvedValueOnce(updatedVendor);
      const input = {
         id: new VendorId().id,
         name: 'any_new_name',
         userId: new UserId().id,
      };
      await sut.execute(input);
      expect(mockRepository.update).toHaveBeenCalledWith(
         expect.objectContaining({ name: 'any_new_name' })
      );
   });

   it('should throw an error if vendor is not found', async () => {
      const { sut } = makeSut();
      const input = {
         id: new VendorId().id,
         name: 'any_vendor_name',
         userId: new UserId().id,
      };
      await expect(sut.execute(input)).rejects.toThrow(
         new EntityError('Vendor not found')
      );
   });

   it('should throw an error if vendor name already exists', async () => {
      const { sut } = makeSut();

      mockRepository.findByUser.mockResolvedValueOnce(
         new Vendor(new VendorId(), 'any_vendor_name', new UserId())
      );
      mockRepository.findVendorByName.mockResolvedValueOnce(
         new Vendor(new VendorId(), 'any_vendor_name', new UserId())
      );
      const input = {
         id: new VendorId().id,
         name: 'any_vendor_name',
         userId: new UserId().id,
      };
      await expect(sut.execute(input)).rejects.toThrow(
         new EntityError('Vendor name already exists')
      );
   });
});
