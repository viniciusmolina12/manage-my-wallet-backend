import EntityError from '@core/domain/@shared/error/entity.error';
import UpdateItemUseCase from '@core/usecases/item/update/update.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import { Validator } from '@core/domain/interfaces/validator.interface';
interface InputUpdateItemControllerDto {
   id: string;
   name: string;
   categoryId: string;
   description?: string;
   userId: string;
}

interface OutputUpdateItemControllerDto {
   name: string;
   categoryId: string;
   description?: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class UpdateItemController {
   constructor(
      private readonly updateItemUseCase: UpdateItemUseCase,
      private readonly validator: Validator
   ) {
      this.updateItemUseCase = updateItemUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputUpdateItemControllerDto>
   ): Promise<OutputControllerDto<OutputUpdateItemControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { id, name, categoryId, description, userId } = input.data;
         const item = await this.updateItemUseCase.execute({
            id,
            name,
            categoryId,
            description,
            userId,
         });
         const output = {
            name: item.name,
            categoryId: item.categoryId,
            description: item.description,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
         };
         return response<OutputUpdateItemControllerDto>(
            200,
            'Item updated succesfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
