import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import {
   InputFindCategoryDto,
   OutputFindCategoryDto,
} from './find.category.dto';
import EntityError from '@core/domain/@shared/error/entity.error';

export default class FindCategoryUseCase {
   constructor(private readonly categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   async execute(input: InputFindCategoryDto): Promise<OutputFindCategoryDto> {
      const category = await this.categoryRepository.findByUser(
         input.id,
         input.userId
      );
      if (!category) {
         throw new EntityError('Category not found');
      }
      return {
         id: category.id,
         name: category.name,
         description: category?.description,
         createdAt: category.createdAt,
         updatedAt: category.updatedAt,
      };
   }
}
