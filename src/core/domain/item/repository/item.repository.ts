import { RepositoryInterface } from '../../@shared/repository.interface';
import Item from '../entity/item.entity';

export interface ItemRepository extends RepositoryInterface<Item> {
   findByUser(id: string, userId: string): Promise<Item | null>;
   findAllByUserId(userId: string): Promise<Item[]>;
   deleteByUser(id: string, userId: string): Promise<void>;
}
