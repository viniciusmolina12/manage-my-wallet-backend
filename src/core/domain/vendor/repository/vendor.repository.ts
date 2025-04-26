import { RepositoryInterface } from '../../@shared/repository.interface';
import Vendor from '../entity/vendor.entity';

export interface VendorRepository extends RepositoryInterface<Vendor> {
   findVendorByName(name: string, userId: string): Promise<Vendor | null>;
   findByUser(id: string, userId: string): Promise<Vendor | null>;
   deleteByUser(id: string, userId: string): Promise<void>;
   findAllByUser(userId: string): Promise<Vendor[]>;
}
