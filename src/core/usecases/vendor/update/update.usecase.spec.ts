import Vendor from '@core/domain/vendor/entity/vendor.entity';
import mockRepository from '../__mocks__/repository.mock';
import { UpdateVendorUseCase } from './update.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
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
         'any_vendor_id',
         'any_older_name',
         'any_user_id'
      );
      mockRepository.findByUser.mockResolvedValueOnce(updatedVendor);
      const input = {
         id: 'any_vendor_id',
         name: 'any_new_name',
         userId: 'any_user_id',
      };
      await sut.execute(input);
      expect(mockRepository.update).toHaveBeenCalledWith(
         expect.objectContaining({ name: 'any_new_name' })
      );
   });

   it('should throw an error if vendor is not found', async () => {
      const { sut } = makeSut();
      const input = {
         id: 'any_vendor_id',
         name: 'any_vendor_name',
         userId: 'any_user_id',
      };
      await expect(sut.execute(input)).rejects.toThrow(
         new EntityError('Vendor not found')
      );
   });

   it('should throw an error if vendor name already exists', async () => {
      const { sut } = makeSut();

      mockRepository.findByUser.mockResolvedValueOnce(
         new Vendor('any_vendor_id', 'any_vendor_name', 'any_user_id')
      );
      mockRepository.findVendorByName.mockResolvedValueOnce(
         new Vendor('any_vendor_id', 'any_vendor_name', 'any_user_id')
      );
      const input = {
         id: 'any_vendor_id',
         name: 'any_vendor_name',
         userId: 'any_user_id',
      };
      await expect(sut.execute(input)).rejects.toThrow(
         new EntityError('Vendor name already exists')
      );
   });
});
