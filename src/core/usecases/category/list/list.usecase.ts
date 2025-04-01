import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import { OutputListCategoryDto } from './list.category.dto';

export default class ListCategoryUseCase {
   constructor(private categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   async execute(): Promise<OutputListCategoryDto> {
      const categories = await this.categoryRepository.findAll();
      return {
         categories: categories.map((category) => ({
            id: category.id,
            name: category.name,
            description: category?.description,
         })),
      };
   }
}
