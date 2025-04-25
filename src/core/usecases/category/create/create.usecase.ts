import { v4 as uuid } from 'uuid';
import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import {
   InputCreateCategoryDto,
   OutputCreateCategoryDto,
} from './create.category.dto';
import Category from '@core/domain/category/entity/category.entity';

export default class CreateCategoryUseCase {
   constructor(private categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }
   async execute(
      input: InputCreateCategoryDto
   ): Promise<OutputCreateCategoryDto> {
      const categoryAlreadyExists =
         await this.categoryRepository.findCategoryByName(
            input.name,
            input.userId
         );
      if (categoryAlreadyExists) {
         throw new Error('Category already exists');
      }
      const category = new Category(
         uuid(),
         input.name,
         input.userId,
         input?.description
      );

      await this.categoryRepository.create(category);
      return {
         id: category.id,
         name: category.name,
         description: category?.description,
      };
   }
}
