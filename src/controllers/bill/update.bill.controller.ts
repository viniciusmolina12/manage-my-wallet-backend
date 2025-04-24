import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import UpdateBillUseCase from '@core/usecases/bill/update/update.usecase';

interface InputUpdateBillControllerDto {
   id: string;
   name: string;
   userId: string;
   description?: string;
   items: {
      id?: string;
      itemId: string;
      price: number;
      quantity: number;
   }[];
}

interface OutputUpdateBillControllerDto {
   name: string;
   description?: string;
   total: number;
   items: {
      quantity: number;
      price: number;
      itemId: string;
   }[];
}

export default class UpdateBillController {
   constructor(private readonly updateBillUseCase: UpdateBillUseCase) {
      this.updateBillUseCase = updateBillUseCase;
   }
   public async handle(
      input: InputControllerDto<InputUpdateBillControllerDto>
   ): Promise<OutputControllerDto<OutputUpdateBillControllerDto>> {
      try {
         const bill = await this.updateBillUseCase.execute(input.data);
         const output = {
            name: bill.name,
            description: bill.description,
            total: bill.total,
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
