import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import UpdateBillUseCase from '@core/usecases/bill/update/update.usecase';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputUpdateBillControllerDto {
   id: string;
   name: string;
   userId: string;
   description?: string;
   vendorId: string;
   date: Date;
   items: {
      id?: string;
      itemId: string;
      price: number;
      quantity: number;
   }[];
}

interface OutputUpdateBillControllerDto {
   id: string;
   name: string;
   description?: string;
   total: number;
   vendorId: string;
   date: string;
   createdAt: Date;
   updatedAt: Date;
   items: {
      quantity: number;
      price: number;
      itemId: string;
   }[];
}

export default class UpdateBillController {
   constructor(
      private readonly updateBillUseCase: UpdateBillUseCase,
      private readonly validator: Validator
   ) {
      this.updateBillUseCase = updateBillUseCase;
   }
   public async handle(
      input: InputControllerDto<InputUpdateBillControllerDto>
   ): Promise<OutputControllerDto<OutputUpdateBillControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors.join(', '));
         const bill = await this.updateBillUseCase.execute(input.data);
         const output = {
            id: bill.id,
            name: bill.name,
            description: bill.description,
            total: bill.total,
            vendorId: bill.vendorId,
            date: bill.date.toISOString().split('T')[0],
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            items: bill.items.map((item) => ({
               quantity: item.quantity,
               price: item.price,
               itemId: item.itemId,
            })),
         };
         return response<OutputUpdateBillControllerDto>(
            200,
            'Bill updated successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
