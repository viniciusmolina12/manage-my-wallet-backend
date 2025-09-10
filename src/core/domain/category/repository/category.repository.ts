import { RepositoryInterface } from '../../@shared/repository.interface';
import Category from '../entity/category.entity';

export interface CategoryRepository extends RepositoryInterface<Category> {
   findCategoryByName(
      name: string,
      userId: string
   ): Promise<Category | undefined>;
   deleteByUser(id: string, userId: string): Promise<void>;
   findByUser(id: string, userId: string): Promise<Category | null>;
   findAllByUser(userId: string): Promise<Category[]>;
   findCategoriesByIds(ids: string[], userId: string): Promise<Category[]>;
}
