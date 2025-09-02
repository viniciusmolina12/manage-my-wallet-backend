import Vendor from '@core/domain/vendor/entity/vendor.entity';
import { ListVendorUseCase } from './list.usecase';
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
   sut: ListVendorUseCase;
}

const makeSut = (): SutTypes => {
   const sut = new ListVendorUseCase(mockRepository);
   return {
      sut,
   };
};

describe('ListVendorUseCase', () => {
   it('should list all vendors', async () => {
      mockRepository.findAllByUser.mockResolvedValueOnce([
         new Vendor('any_vendor_id', 'any_vendor_name', 'any_user_id'),
         new Vendor('any_vendor_id_2', 'any_vendor_name_2', 'any_user_id'),
      ]);
      const { sut } = makeSut();
      const input = {
         userId: 'any_user_id',
      };
      const output = await sut.execute(input);
      expect(output).toBeDefined();
      expect(output.vendors).toBeDefined();
      expect(output.vendors.length).toBe(2);
      expect(output.vendors[0].id).toBe('any_vendor_id');
      expect(output.vendors[0].name).toBe('any_vendor_name');
      expect(output.vendors[0].createdAt).toBeDefined();
      expect(output.vendors[1].id).toBe('any_vendor_id_2');
      expect(output.vendors[1].name).toBe('any_vendor_name_2');
      expect(output.vendors[1].createdAt).toBeDefined();
   });

   it('should return an empty array if the user does not have any vendor', async () => {
      mockRepository.findAllByUser.mockResolvedValueOnce([]);
      const { sut } = makeSut();
      const input = {
         userId: 'any_user_id',
      };
      const output = await sut.execute(input);
      expect(output).toBeDefined();
      expect(output.vendors).toBeDefined();
      expect(output.vendors.length).toBe(0);
   });
});
