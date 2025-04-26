import { OutputUpdateVendorDto } from './update.vendor.dto';

import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import { InputUpdateVendorDto } from './update.vendor.dto';
import EntityError from '@core/domain/@shared/error/entity.error';

export class UpdateVendorUseCase {
   constructor(private readonly vendorRepository: VendorRepository) {}

   async execute(input: InputUpdateVendorDto): Promise<OutputUpdateVendorDto> {
      const vendor = await this.vendorRepository.findByUser(
         input.id,
         input.userId
      );
      if (!vendor) throw new EntityError('Vendor not found');

      const newVendorNameAlreadyExits =
         await this.vendorRepository.findVendorByName(input.name, input.userId);
      if (newVendorNameAlreadyExits)
         throw new EntityError('Vendor name already exists');
      vendor.changeName(input.name);
      console.log(vendor);
      await this.vendorRepository.update(vendor);
      return {
         id: vendor.id,
         name: vendor.name,
         createdAt: vendor.createdAt,
         updatedAt: vendor.updatedAt,
      };
   }
}
