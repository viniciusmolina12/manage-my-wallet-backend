import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import { CreateVendorUseCase } from '../create.usecase';
import Vendor, { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
interface SutTypes {
   sut: CreateVendorUseCase;
}

const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
   findVendorByName: jest.fn(),
   findByUser: jest.fn(),
   findAllByUser: jest.fn(),
   deleteByUser: jest.fn(),
};

const makeSut = (): SutTypes => {
   const sut = new CreateVendorUseCase(mockRepository);
   return {
      sut,
   };
};

describe('CreateVendorUseCase', () => {
   it('should create a vendor', async () => {
      const { sut } = makeSut();
      const input = {
         name: 'any_name',
         userId: new UserId().id,
      };
      const output = await sut.execute(input);
      expect(output).toBeTruthy();
      expect(output.id).toBeDefined();
      expect(output.name).toBe(input.name);
      expect(output.createdAt).toBeDefined();
      expect(output.updatedAt).toBeDefined();
   });

   it('should throw an error if the vendor already exists', async () => {
      const { sut } = makeSut();
      const userId = new UserId();
      const input = {
         name: 'any_name',
         userId: userId.id,
      };
      mockRepository.findVendorByName.mockReturnValueOnce(
         Promise.resolve(
            new Vendor(new VendorId(), 'any_name', new UserId(userId.id))
         )
      );
      await expect(sut.execute(input)).rejects.toThrow('Vendor already exists');
   });

   it('should throw an error if the vendor name is not provided', async () => {
      const { sut } = makeSut();
      const input = {
         name: '',
         userId: new UserId().id,
      };
      await expect(sut.execute(input)).rejects.toThrow(
         'vendor: Name is required, '
      );
   });
});
