import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import { InputListVendorDto, OutputListVendorDto } from './list.vendor.dto';

export class ListVendorUseCase {
   constructor(private readonly vendorRepository: VendorRepository) {}

   async execute(input: InputListVendorDto): Promise<OutputListVendorDto> {
      const vendors = await this.vendorRepository.findAllByUser(input.userId);
      return {
         vendors: vendors.map((vendor) => ({
            id: vendor.id,
            name: vendor.name,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt,
         })),
      };
   }
}
