import Vendor from '@core/domain/vendor/entity/vendor.entity';
import { FindVendorUseCase } from './find.usecase';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';

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

interface SutTypes {
   sut: FindVendorUseCase;
}

const makeSut = (): SutTypes => {
   const sut = new FindVendorUseCase(mockRepository);
   return {
      sut,
   };
};

describe('FindVendorUseCase', () => {
   it('should find a vendor', async () => {
      const { sut } = makeSut();
      const input = {
         id: 'any_id',
         userId: 'any_user_id',
      };
      mockRepository.findByUser.mockReturnValueOnce(
         Promise.resolve(new Vendor('any_id', 'any_name', 'any_user_id'))
      );
      const output = await sut.execute(input);
      expect(output).toBeTruthy();
      expect(output.id).toBeDefined();
      expect(output.name).toBe('any_name');
      expect(output.createdAt).toBeDefined();
      expect(output.updatedAt).toBeDefined();
   });

   it('should throw an error if the vendor is not found', async () => {
      const { sut } = makeSut();
      const input = {
         id: 'any_id',
         userId: 'any_user_id',
      };
      mockRepository.findByUser.mockReturnValueOnce(Promise.resolve(null));
      await expect(sut.execute(input)).rejects.toThrow('Vendor not found');
   });
});
