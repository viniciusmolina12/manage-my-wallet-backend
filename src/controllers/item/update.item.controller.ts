import EntityError from '@core/domain/@shared/error/entity.error';
import UpdateItemUseCase from '@core/usecases/item/update/update.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
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
}

export default class UpdateItemController {
   constructor(private readonly updateItemUseCase: UpdateItemUseCase) {
      this.updateItemUseCase = updateItemUseCase;
   }
   public async handle(
      input: InputControllerDto<InputUpdateItemControllerDto>
   ): Promise<OutputControllerDto<OutputUpdateItemControllerDto>> {
      try {
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
