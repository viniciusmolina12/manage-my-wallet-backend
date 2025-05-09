import UpdateCategoryUseCase from '@core/usecases/category/update/update.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';

interface InputUpdateCategoryControllerDto {
   id: string;
   name: string;
   description?: string;
   userId: string;
}

interface OutputUpdateCategoryControllerDto {
   id: string;
   name: string;
   description?: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class UpdateCategoryController {
   constructor(private readonly updateCategoryUseCase: UpdateCategoryUseCase) {
      this.updateCategoryUseCase = updateCategoryUseCase;
   }
   public async handle(
      input: InputControllerDto<InputUpdateCategoryControllerDto>
   ): Promise<OutputControllerDto<OutputUpdateCategoryControllerDto>> {
      try {
         const { id, name, description, userId } = input.data;
         const category = await this.updateCategoryUseCase.execute({
            id,
            name,
            description,
            userId,
         });
         const output = {
            id: category.id,
            name: category.name,
            description: category.description,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
         };
         return response<OutputUpdateCategoryControllerDto>(
            200,
            'Category updated succesfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
