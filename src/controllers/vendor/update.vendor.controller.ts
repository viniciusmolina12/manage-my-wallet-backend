import { UpdateVendorUseCase } from '@core/usecases/vendor/update/update.usecase';
import { InputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { OutputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import EntityError from '@core/domain/@shared/error/entity.error';
import { Validator } from '@core/domain/interfaces/validator.interface';
interface InputUpdateVendorControllerDto {
   id: string;
   name: string;
   userId: string;
}

interface OutputUpdateVendorControllerDto {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class UpdateVendorController {
   constructor(
      private readonly updateVendorUseCase: UpdateVendorUseCase,
      private readonly validator: Validator
   ) {
      this.updateVendorUseCase = updateVendorUseCase;
      this.validator = validator;
   }

   async handle(
      input: InputControllerDto<InputUpdateVendorControllerDto>
   ): Promise<OutputControllerDto<OutputUpdateVendorControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors.join(', '));
         const { id, name, userId } = input.data;
         const vendor = await this.updateVendorUseCase.execute({
            id,
            name,
            userId,
         });
         const output = {
            id: vendor.id,
            name: vendor.name,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt,
         };
         return response<OutputUpdateVendorControllerDto>(
            200,
            'Vendor updated successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
