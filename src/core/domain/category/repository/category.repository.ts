import { RepositoryInterface } from '../../@shared/repository.interface';
import Category from '../entity/category.entity';

export interface CategoryRepository extends RepositoryInterface<Category> {
   findCategoryByName(name: string): Promise<Category | undefined>;
}
