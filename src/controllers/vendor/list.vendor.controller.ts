import { OutputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { ListVendorUseCase } from '@core/usecases/vendor/list/list.usecase';
import { InputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import EntityError from '@core/domain/@shared/error/entity.error';

interface InputListVendorControllerDto {
   userId: string;
}

interface OutputListVendorControllerDto {
   vendors: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
}

export default class ListVendorController {
   constructor(private readonly listVendorUseCase: ListVendorUseCase) {}

   async handle(
      input: InputControllerDto<InputListVendorControllerDto>
   ): Promise<OutputControllerDto<OutputListVendorControllerDto>> {
      try {
         const { userId } = input.data;
         const vendor = await this.listVendorUseCase.execute({
            userId,
         });
         const output = {
            vendors: vendor.vendors.map((vendor) => ({
               id: vendor.id,
               name: vendor.name,
               createdAt: vendor.createdAt,
               updatedAt: vendor.updatedAt,
            })),
         };
         return response<OutputListVendorControllerDto>(
            200,
            'Vendors listed successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
