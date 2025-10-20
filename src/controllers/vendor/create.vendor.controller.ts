import { OutputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { CreateVendorUseCase } from '@core/usecases/vendor/create/create.usecase';
import { InputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import EntityError from '@core/domain/@shared/error/entity.error';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputCreateVendorControllerDto {
   name: string;
   userId: string;
}

interface OutputCreateVendorControllerDto {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class CreateVendorController {
   constructor(
      private readonly createVendorUseCase: CreateVendorUseCase,
      private readonly validator: Validator
   ) {
      this.createVendorUseCase = createVendorUseCase;
      this.validator = validator;
   }

   async handle(
      input: InputControllerDto<InputCreateVendorControllerDto>
   ): Promise<OutputControllerDto<OutputCreateVendorControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { name, userId } = input.data;
         const vendor = await this.createVendorUseCase.execute({
            name,
            userId,
         });
         const output = {
            id: vendor.id,
            name: vendor.name,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt,
         };
         return response<OutputCreateVendorControllerDto>(
            201,
            'Vendor created successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
