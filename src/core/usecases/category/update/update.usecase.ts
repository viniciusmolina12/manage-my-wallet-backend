import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import {
   InputUpdateCategoryDto,
   OutputUpdateCategoryDto,
} from './update.category.dto';
import Category from '@core/domain/category/entity/category.entity';

export default class UpdateCategoryUseCase {
   constructor(private categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   async execute(
      input: InputUpdateCategoryDto
   ): Promise<OutputUpdateCategoryDto> {
      const categoryAlreadyExists =
         await this.categoryRepository.findCategoryByName(input.name);
      if (categoryAlreadyExists) {
         throw new Error('Category already exists');
      }

      const categoryFound = await this.categoryRepository.find(input.id);
      if (!categoryFound) {
         throw new Error('Category not found');
      }

      const category = new Category(input.id, input.name, input?.description);
      await this.categoryRepository.update(category);
      return {
         name: category.name,
         description: category.description,
      };
   }
}
