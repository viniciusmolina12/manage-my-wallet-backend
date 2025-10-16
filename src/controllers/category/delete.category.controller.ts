import DeleteCategoryUseCase from '@core/usecases/category/delete/delete.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputDeleteCategoryControllerDto {
   id: string;
   userId: string;
}

interface OutputDeleteCategoryControllerDto {}

export default class DeleteCategoryController {
   constructor(
      private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
      private readonly validator: Validator
   ) {
      this.deleteCategoryUseCase = deleteCategoryUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputDeleteCategoryControllerDto>
   ): Promise<OutputControllerDto<OutputDeleteCategoryControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors.join(', '));
         const { id, userId } = input.data;
         await this.deleteCategoryUseCase.execute({ id, userId });
         return response<OutputDeleteCategoryControllerDto>(
            200,
            'Category deleted succesfully'
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
