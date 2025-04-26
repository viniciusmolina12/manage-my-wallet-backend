import { OutputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { InputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import EntityError from '@core/domain/@shared/error/entity.error';
import { FindVendorUseCase } from '@core/usecases/vendor/find/find.usecase';

interface InputFindVendorControllerDto {
   id: string;
   userId: string;
}

interface OutputFindVendorControllerDto {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}

export default class FindVendorController {
   constructor(private readonly findVendorUseCase: FindVendorUseCase) {}

   async handle(
      input: InputControllerDto<InputFindVendorControllerDto>
   ): Promise<OutputControllerDto<OutputFindVendorControllerDto>> {
      try {
         const { id, userId } = input.data;
         const vendor = await this.findVendorUseCase.execute({
            id,
            userId,
         });
         const output = {
            id: vendor.id,
            name: vendor.name,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt,
         };
         return response<OutputFindVendorControllerDto>(
            200,
            'Vendor found successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
