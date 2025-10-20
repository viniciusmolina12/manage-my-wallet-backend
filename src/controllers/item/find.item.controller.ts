import EntityError from '@core/domain/@shared/error/entity.error';
import FindItemUseCase from '@core/usecases/item/find/find.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputFindItemControllerDto {
   id: string;
   userId: string;
}

interface OutputFindItemControllerDto {
   id: string;
   name: string;
   description?: string;
   categoryId: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class FindItemController {
   constructor(
      private readonly findItemUseCase: FindItemUseCase,
      private readonly validator: Validator
   ) {
      this.findItemUseCase = findItemUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputFindItemControllerDto>
   ): Promise<OutputControllerDto<OutputFindItemControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { id, userId } = input.data;
         const item = await this.findItemUseCase.execute({ id, userId });
         const output = {
            id: item.id,
            name: item.name,
            description: item.description,
            categoryId: item.categoryId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
         };
         return response<OutputFindItemControllerDto>(
            200,
            'Item founded succesfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
