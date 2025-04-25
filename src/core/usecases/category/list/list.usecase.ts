import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import { OutputListCategoryDto } from './list.category.dto';

export type InputListCategoryDto = {
   userId: string;
};

export default class ListCategoryUseCase {
   constructor(private categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   async execute(input: InputListCategoryDto): Promise<OutputListCategoryDto> {
      const categories = await this.categoryRepository.findAllByUser(
         input.userId
      );
      return {
         categories: categories.map((category) => ({
            id: category.id,
            name: category.name,
            description: category?.description,
         })),
      };
   }
}
