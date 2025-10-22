import { Filter, Pagination } from '@core/domain/@shared/filter/filter';
import { RepositoryInterface } from '../../@shared/repository.interface';
import Item from '../entity/item.entity';

export interface SearchItem {
   name?: string;
}

export interface ItemRepository extends RepositoryInterface<Item> {
   findByUser(id: string, userId: string): Promise<Item | null>;
   findAllByUserId(userId: string): Promise<Item[]>;
   findAllByUser(
      userId: string,
      filter: Filter<SearchItem>
   ): Promise<Pagination<Item>>;
   deleteByUser(id: string, userId: string): Promise<void>;
   findByName(name: string, userId: string): Promise<Item | null>;
   findItemsByIds(ids: string[], userId: string): Promise<Item[]>;
}
