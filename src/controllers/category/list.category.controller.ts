import ListCategoryUseCase from '@core/usecases/category/list/list.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';

interface InputListCategoryControllerDto {
   userId: string;
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
   constructor(private readonly listCategoryUseCase: ListCategoryUseCase) {
      this.listCategoryUseCase = listCategoryUseCase;
   }
   public async handle(
      input: InputControllerDto<InputListCategoryControllerDto>
   ): Promise<OutputControllerDto<OutputListCategoryControllerDto>> {
      try {
         const { userId } = input.data;
         const categories = await this.listCategoryUseCase.execute({
            userId,
         });
         const output = {
            categories: categories.categories.map((category) => ({
               id: category.id,
               name: category.name,
               description: category.description,
               createdAt: category.createdAt,
               updatedAt: category.updatedAt,
            })),
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
