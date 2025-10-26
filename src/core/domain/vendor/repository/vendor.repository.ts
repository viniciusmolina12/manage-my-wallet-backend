import { Filter, Pagination } from '@core/domain/@shared/filter/filter';
import { RepositoryInterface } from '../../@shared/repository.interface';
import Vendor from '../entity/vendor.entity';

export interface SearchVendor {
   name?: string;
}

export interface VendorRepository extends RepositoryInterface<Vendor> {
   findVendorByName(name: string, userId: string): Promise<Vendor | null>;
   findByUser(id: string, userId: string): Promise<Vendor | null>;
   deleteByUser(id: string, userId: string): Promise<void>;
   findAllByUser(
      userId: string,
      filter: Filter<SearchVendor>
   ): Promise<Pagination<Vendor>>;
   findVendorsByIds(ids: string[], userId: string): Promise<Vendor[]>;
}
