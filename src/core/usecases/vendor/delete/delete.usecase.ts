import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import {
   InputDeleteVendorDto,
   OutputDeleteVendorDto,
} from './delete.vendor.dto';
import EntityError from '@core/domain/@shared/error/entity.error';

export default class DeleteVendorUseCase {
   constructor(private vendorRepository: VendorRepository) {}

   async execute(input: InputDeleteVendorDto): Promise<OutputDeleteVendorDto> {
      const vendor = await this.vendorRepository.findByUser(
         input.id,
         input.userId
      );
      if (!vendor) throw new EntityError('Vendor not found');
      await this.vendorRepository.deleteByUser(input.id, input.userId);
   }
}
