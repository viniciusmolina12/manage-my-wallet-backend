import EntityError from '@core/domain/@shared/error/entity.error';
import CreateItemUseCase from '@core/usecases/item/create/create.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputCreateItemControllerDto {
   name: string;
   description?: string;
   categoryId: string;
   userId: string;
}

interface OutputCreateItemControllerDto {
   id: string;
   name: string;
   description?: string;
   categoryId: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class CreateItemController {
   constructor(
      private readonly createItemUseCase: CreateItemUseCase,
      private readonly validator: Validator
   ) {
      this.createItemUseCase = createItemUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputCreateItemControllerDto>
   ): Promise<OutputControllerDto<OutputCreateItemControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors.join(', '));
         const { name, description, categoryId, userId } = input.data;

         const item = await this.createItemUseCase.execute({
            name,
            description,
            categoryId,
            userId,
         });
         const output = {
            id: item.id,
            name: item.name,
            description: item.description,
            categoryId: item.categoryId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
         };
         return response<OutputCreateItemControllerDto>(
            201,
            'Item created successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
