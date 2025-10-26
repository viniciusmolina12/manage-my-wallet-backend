import {
   VendorRepository,
   SearchVendor,
} from '@core/domain/vendor/repository/vendor.repository';
import { InputListVendorDto, OutputListVendorDto } from './list.vendor.dto';
import { Filter } from '@core/domain/@shared/filter/filter';

export class ListVendorUseCase {
   constructor(private readonly vendorRepository: VendorRepository) {}

   async execute(
      input: InputListVendorDto,
      filter: Filter<SearchVendor>
   ): Promise<OutputListVendorDto> {
      const { data, ...meta } = await this.vendorRepository.findAllByUser(
         input.userId,
         filter
      );
      const output = data.map((vendor: any) => ({
         id: vendor.id,
         name: vendor.name,
         createdAt: vendor.createdAt,
         updatedAt: vendor.updatedAt,
      }));
      return { vendors: output, meta };
   }
}
