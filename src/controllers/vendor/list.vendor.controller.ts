import { OutputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { ListVendorUseCase } from '@core/usecases/vendor/list/list.usecase';
import { InputControllerDto } from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import EntityError from '@core/domain/@shared/error/entity.error';
import { Validator } from '@core/interfaces/validator.interface';
import { SearchVendor } from '@core/domain/vendor/repository/vendor.repository';
import { Filter } from '@core/domain/@shared/filter/filter';

interface InputListVendorControllerDto {
   userId: string;
   page: number;
   perPage: number;
   order: string;
   search: SearchVendor;
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
   constructor(
      private readonly listVendorUseCase: ListVendorUseCase,
      private readonly validator: Validator
   ) {
      this.listVendorUseCase = listVendorUseCase;
      this.validator = validator;
   }

   async handle(
      input: InputControllerDto<InputListVendorControllerDto>
   ): Promise<OutputControllerDto<OutputListVendorControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { userId, page, perPage, order, search } = input.data;
         const filter = new Filter(page, perPage, order, search);
         const { vendors, meta } = await this.listVendorUseCase.execute(
            { userId },
            filter
         );
         const output = {
            vendors: vendors.map((vendor) => ({
               id: vendor.id,
               name: vendor.name,
               createdAt: vendor.createdAt,
               updatedAt: vendor.updatedAt,
            })),
            meta,
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
