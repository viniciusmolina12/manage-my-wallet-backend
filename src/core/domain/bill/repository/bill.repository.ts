import { RepositoryInterface } from '../../@shared/repository.interface';
import Bill from '../entity/bill.entity';
import { Filter, Pagination } from '../../@shared/filter/filter';

export interface SearchBill {
   name?: string;
   vendorId?: string;
   startDate?: Date;
   endDate?: Date;
}

export interface BillRepository extends RepositoryInterface<Bill> {
   findByUser(id: string, userId: string): Promise<Bill | null>;
   deleteByUser(id: string, userId: string): Promise<void>;
   findAllByUser(
      userId: string,
      filter: Filter<SearchBill>
   ): Promise<Pagination<Bill>>;
}
