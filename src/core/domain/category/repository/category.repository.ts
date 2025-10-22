import { Filter, Pagination } from '@core/domain/@shared/filter/filter';
import { RepositoryInterface } from '../../@shared/repository.interface';
import Category from '../entity/category.entity';

export interface SearchCategory {
   name?: string;
}

export interface CategoryRepository extends RepositoryInterface<Category> {
   findCategoryByName(
      name: string,
      userId: string
   ): Promise<Category | undefined>;
   deleteByUser(id: string, userId: string): Promise<void>;
   findByUser(id: string, userId: string): Promise<Category | null>;
   findAllByUser(
      userId: string,
      filter: Filter<SearchCategory>
   ): Promise<Pagination<Category>>;
   findCategoriesByIds(ids: string[], userId: string): Promise<Category[]>;
}
