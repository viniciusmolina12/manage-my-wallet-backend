import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { ListVendorUseCase } from '../list.usecase';
import { UserId } from '@core/domain/user/entity/user.entity';
import { Filter } from '@core/domain/@shared/filter/filter';

const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
   findVendorByName: jest.fn(),
   findByUser: jest.fn(),
   findVendorsByIds: jest.fn(),
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

const mockVendorList = [
   {
      id: 'any_id',
      name: 'Vendor 2',
      userId: 'any_user_id',
      createdAt: new Date(),
      updatedAt: new Date(),
   },
   {
      id: 'other_id',
      name: 'Vendor 1',
      userId: 'any_user_id',
      createdAt: new Date(),
      updatedAt: new Date(),
   },
];

const mockPagination = {
   page: 1,
   perPage: 10,
   total: 2,
   hasNext: false,
   data: mockVendorList,
};

describe('ListVendorUseCase', () => {
   it('should list all vendors', async () => {
      const userId = new UserId();
      mockRepository.findAllByUser.mockResolvedValueOnce(mockPagination);
      const { sut } = makeSut();
      const input = {
         userId: userId.id,
      };
      const filter = new Filter(1, 10, 'asc', { name: 'test' });
      const output = await sut.execute(input, filter);
      expect(output).toBeDefined();
      expect(output.vendors).toBeDefined();
      expect(output.vendors.length).toBe(2);
      expect(output.vendors[0].id).toBe('any_id');
      expect(output.vendors[0].name).toBe('Vendor 2');
      expect(output.vendors[0].createdAt).toBeDefined();
      expect(output.vendors[1].id).toBe('other_id');
      expect(output.vendors[1].name).toBe('Vendor 1');
      expect(output.vendors[1].createdAt).toBeDefined();
      expect(output.meta).toEqual({
         page: 1,
         perPage: 10,
         total: 2,
         hasNext: false,
      });
   });

   it('should return an empty array if the user does not have any vendor', async () => {
      const emptyPagination = {
         page: 1,
         perPage: 10,
         total: 0,
         hasNext: false,
         data: [],
      };
      mockRepository.findAllByUser.mockResolvedValueOnce(emptyPagination);
      const { sut } = makeSut();
      const input = {
         userId: new UserId().id,
      };
      const filter = new Filter(1, 10, 'asc', { name: 'test' });
      const output = await sut.execute(input, filter);
      expect(output).toBeDefined();
      expect(output.vendors).toBeDefined();
      expect(output.vendors.length).toBe(0);
      expect(output.meta.total).toBe(0);
   });
});
