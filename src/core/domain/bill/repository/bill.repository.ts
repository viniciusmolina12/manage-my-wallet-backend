import { RepositoryInterface } from '../../@shared/repository.interface';
import Bill from '../entity/bill.entity';

export interface BillRepository extends RepositoryInterface<Bill> {
   findByUser(id: string, userId: string): Promise<Bill | null>;
   findAllByUser(userId: string): Promise<Bill[]>;
   deleteByUser(id: string, userId: string): Promise<void>;
}
