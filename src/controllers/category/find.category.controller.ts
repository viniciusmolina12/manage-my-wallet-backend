import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import FindCategoryUseCase from '@core/usecases/category/find/find.usecase';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputFindCategoryControllerDto {
   id: string;
   userId: string;
}

interface OutputFindCategoryControllerDto {
   id: string;
   name: string;
   description?: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class FindCategoryController {
   constructor(
      private readonly findCategoryUseCase: FindCategoryUseCase,
      private readonly validator: Validator
   ) {
      this.findCategoryUseCase = findCategoryUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputFindCategoryControllerDto>
   ): Promise<OutputControllerDto<OutputFindCategoryControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { id, userId } = input.data;
         const category = await this.findCategoryUseCase.execute({
            id,
            userId,
         });
         const output = {
            id: category.id,
            name: category.name,
            description: category.description,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
         };
         return response<OutputFindCategoryControllerDto>(
            200,
            'Category founded succesfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
