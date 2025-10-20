import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import CreateCategoryUseCase from '@core/usecases/category/create/create.usecase';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputCreateCategoryControllerDto {
   name: string;
   description?: string;
   userId: string;
}

interface OutputCreateCategoryControllerDto {
   id: string;
   name: string;
   description?: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class CreateCategoryController {
   constructor(
      private readonly createCategoryUseCase: CreateCategoryUseCase,
      private readonly validator: Validator
   ) {
      this.createCategoryUseCase = createCategoryUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputCreateCategoryControllerDto>
   ): Promise<OutputControllerDto<OutputCreateCategoryControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { name, description, userId } = input.data;
         const category = await this.createCategoryUseCase.execute({
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
         return response<OutputCreateCategoryControllerDto>(
            201,
            'Category created successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
