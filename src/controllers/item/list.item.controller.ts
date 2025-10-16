import EntityError from '@core/domain/@shared/error/entity.error';
import ListItemUsecase from '@core/usecases/item/list/list.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputListItemControllerDto {
   userId: string;
}

interface OutputListItemControllerDto {
   items: {
      id: string;
      name: string;
      description?: string;
      categoryId: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
}

export default class ListItemController {
   constructor(
      private readonly listItemUseCase: ListItemUsecase,
      private readonly validator: Validator
   ) {
      this.listItemUseCase = listItemUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputListItemControllerDto>
   ): Promise<OutputControllerDto<OutputListItemControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors.join(', '));
         const items = await this.listItemUseCase.execute({
            userId: input.data.userId,
         });
         const output = {
            items: items.items.map((item) => ({
               id: item.id,
               name: item.name,
               description: item.description,
               categoryId: item.categoryId,
               createdAt: item.createdAt,
               updatedAt: item.updatedAt,
            })),
         };
         return response<OutputListItemControllerDto>(
            200,
            'Items listed succesfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
