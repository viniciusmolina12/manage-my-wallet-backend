import ListCategoryUseCase from '@core/usecases/category/list/list.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import { Validator } from '@core/interfaces/validator.interface';
import { SearchCategory } from '@core/domain/category/repository/category.repository';
import { Filter } from '@core/domain/@shared/filter/filter';

interface InputListCategoryControllerDto {
   userId: string;
   page: number;
   perPage: number;
   order: string;
   search: SearchCategory;
}

interface OutputListCategoryControllerDto {
   categories: {
      id: string;
      name: string;
      description?: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
}

export default class ListCategoryController {
   constructor(
      private readonly listCategoryUseCase: ListCategoryUseCase,
      private readonly validator: Validator
   ) {
      this.listCategoryUseCase = listCategoryUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputListCategoryControllerDto>
   ): Promise<OutputControllerDto<OutputListCategoryControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { userId, page, perPage, order, search } = input.data;
         const filter = new Filter(page, perPage, order, search);
         const { categories, meta } = await this.listCategoryUseCase.execute(
            { userId },
            filter
         );
         const output = {
            categories: categories.map((category) => ({
               id: category.id,
               name: category.name,
               description: category.description,
               createdAt: category.createdAt,
               updatedAt: category.updatedAt,
            })),
            meta,
         };
         return response<OutputListCategoryControllerDto>(
            200,
            'Categories listed succesfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
