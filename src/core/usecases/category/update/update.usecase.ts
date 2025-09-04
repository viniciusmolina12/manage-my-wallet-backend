import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import {
   InputUpdateCategoryDto,
   OutputUpdateCategoryDto,
} from './update.category.dto';
import Category, {
   CategoryId,
} from '@core/domain/category/entity/category.entity';

export default class UpdateCategoryUseCase {
   constructor(private categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   async execute(
      input: InputUpdateCategoryDto
   ): Promise<OutputUpdateCategoryDto> {
      const categoryId = new CategoryId(input.id);
      const categoryAlreadyExists =
         await this.categoryRepository.findCategoryByName(
            input.name,
            input.userId
         );
      if (categoryAlreadyExists) {
         throw new Error('Category already exists');
      }

      const categoryFound = await this.categoryRepository.findByUser(
         input.id,
         input.userId
      );
      if (!categoryFound) {
         throw new Error('Category not found');
      }

      const category = new Category(
         categoryId,
         input.name,
         input.userId,
         input?.description
      );
      await this.categoryRepository.update(category);
      return {
         id: category.id.toString(),
         name: category.name,
         description: category.description,
         createdAt: categoryFound.createdAt,
         updatedAt: category.updatedAt,
      };
   }
}
