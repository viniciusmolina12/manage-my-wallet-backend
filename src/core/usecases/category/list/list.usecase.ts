import {
   CategoryRepository,
   SearchCategory,
} from '@core/domain/category/repository/category.repository';
import { OutputListCategoryDto } from './list.category.dto';
import { Filter } from '@core/domain/@shared/filter/filter';

export type InputListCategoryDto = {
   userId: string;
};

export default class ListCategoryUseCase {
   constructor(private categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   async execute(
      input: InputListCategoryDto,
      filter: Filter<SearchCategory>
   ): Promise<OutputListCategoryDto> {
      const { data, ...meta } = await this.categoryRepository.findAllByUser(
         input.userId,
         filter
      );
      const output = data.map((category) => ({
         id: category.id.toString(),
         name: category.name,
         description: category?.description,
         createdAt: category.createdAt,
         updatedAt: category.updatedAt,
      }));
      return {
         categories: output,
         meta,
      };
   }
}
