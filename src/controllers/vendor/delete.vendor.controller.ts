import { OutputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { InputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import EntityError from '@core/domain/@shared/error/entity.error';
import DeleteVendorUseCase from '@core/usecases/vendor/delete/delete.usecase';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputDeleteVendorControllerDto {
   id: string;
   userId: string;
}

type OutputDeleteVendorControllerDto = void;

export default class DeleteVendorController {
   constructor(
      private readonly deleteVendorUseCase: DeleteVendorUseCase,
      private readonly validator: Validator
   ) {
      this.deleteVendorUseCase = deleteVendorUseCase;
      this.validator = validator;
   }

   async handle(
      input: InputControllerDto<InputDeleteVendorControllerDto>
   ): Promise<OutputControllerDto<OutputDeleteVendorControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors.join(', '));
         const { id, userId } = input.data;
         await this.deleteVendorUseCase.execute({
            id,
            userId,
         });
         return response(200, 'Vendor deleted successfully');
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
