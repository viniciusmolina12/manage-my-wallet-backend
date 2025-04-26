import Vendor from '@core/domain/vendor/entity/vendor.entity';

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
}
