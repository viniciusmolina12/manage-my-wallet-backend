import EntityError from '@core/domain/@shared/error/entity.error';
import DeleteItemUseCase from '@core/usecases/item/delete/delete.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';

interface InputDeleteItemControllerDto {
   id: string;
   userId: string;
}

interface OutputDeleteItemControllerDto {}

export default class DeleteItemController {
   constructor(private readonly deleteItemUseCase: DeleteItemUseCase) {
      this.deleteItemUseCase = deleteItemUseCase;
   }
   public async handle(
      input: InputControllerDto<InputDeleteItemControllerDto>
   ): Promise<OutputControllerDto<OutputDeleteItemControllerDto>> {
      try {
         const { id, userId } = input.data;
         await this.deleteItemUseCase.execute({ id, userId });
         return response<OutputDeleteItemControllerDto>(
            200,
            'Item deleted succesfully'
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
