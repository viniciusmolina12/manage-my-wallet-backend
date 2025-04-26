import Vendor from '@core/domain/vendor/entity/vendor.entity';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';

import { v4 as uuid } from 'uuid';
import EntityError from '@core/domain/@shared/error/entity.error';
import { InputFindVendorDto, OutputFindVendorDto } from './find.vendor.dto';
export class FindVendorUseCase {
   constructor(private readonly vendorRepository: VendorRepository) {}

   async execute(input: InputFindVendorDto): Promise<OutputFindVendorDto> {
      const vendor = await this.vendorRepository.findByUser(
         input.id,
         input.userId
      );
      if (!vendor) throw new EntityError('Vendor not found');
      return {
         id: vendor.id,
         name: vendor.name,
         createdAt: vendor.createdAt,
         updatedAt: vendor.updatedAt,
      };
   }
}
