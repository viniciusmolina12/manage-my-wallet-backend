import Vendor from '@core/domain/vendor/entity/vendor.entity';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import {
   InputCreateVendorDto,
   OutputCreateVendorDto,
} from './create.vendor.dto';
import { v4 as uuid } from 'uuid';
import EntityError from '@core/domain/@shared/error/entity.error';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
export class CreateVendorUseCase {
   constructor(private readonly vendorRepository: VendorRepository) {}

   async execute(input: InputCreateVendorDto): Promise<OutputCreateVendorDto> {
      const vendor = new Vendor(
         new VendorId(uuid()),
         input.name,
         new UserId(input.userId)
      );
      const vendorExists = await this.vendorRepository.findVendorByName(
         vendor.name,
         vendor.userId
      );
      if (vendorExists) throw new EntityError('Vendor already exists');
      await this.vendorRepository.create(vendor);
      return {
         id: vendor.id,
         name: vendor.name,
         createdAt: vendor.createdAt,
         updatedAt: vendor.updatedAt,
      };
   }
}
