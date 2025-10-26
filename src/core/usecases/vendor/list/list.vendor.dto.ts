import Vendor from '@core/domain/vendor/entity/vendor.entity';
import { Pagination } from '@core/domain/@shared/filter/filter';

export interface InputListVendorDto {
   userId: string;
}

export interface OutputListVendorDto {
   vendors: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
   meta: Omit<Pagination<any>, 'data'>;
}
