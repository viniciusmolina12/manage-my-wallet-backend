import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import DeleteBillUseCase from '@core/usecases/bill/delete/delete.usecase';
import { Validator } from '@core/interfaces/validator.interface';

interface InputDeleteBillControllerDto {
   id: string;
   userId: string;
}

type OutputDeleteBillControllerDto = null;

export default class DeleteBillController {
   constructor(
      private readonly deleteBillUseCase: DeleteBillUseCase,
      private readonly validator: Validator
   ) {
      this.deleteBillUseCase = deleteBillUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputDeleteBillControllerDto>
   ): Promise<OutputControllerDto<OutputDeleteBillControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         await this.deleteBillUseCase.execute({
            id: input.data.id,
            userId: input.data.userId,
         });
         return response<OutputDeleteBillControllerDto>(
            200,
            'Bill deleted successfully'
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
