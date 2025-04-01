import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import {
   InputDeleteCategoryDto,
   OutputDeleteCategoryDto,
} from './delete.category.dto';
import EntityError from '@core/domain/@shared/error/entity.error';

export default class DeleteCategoryUseCase {
   constructor(private readonly categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   async execute(
      input: InputDeleteCategoryDto
   ): Promise<OutputDeleteCategoryDto> {
      const category = await this.categoryRepository.find(input);
      if (!category) {
         throw new EntityError('Category not found');
      }
      await this.categoryRepository.delete(input);
   }
}
