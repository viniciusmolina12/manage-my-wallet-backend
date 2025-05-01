import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import FindBillUseCase from '@core/usecases/bill/find/find.usecase';

interface InputFindBillControllerDto {
   id: string;
   userId: string;
}

interface OutputFindBillControllerDto {
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

export default class FindBillController {
   constructor(private readonly findBillUseCase: FindBillUseCase) {
      this.findBillUseCase = findBillUseCase;
   }
   public async handle(
      input: InputControllerDto<InputFindBillControllerDto>
   ): Promise<OutputControllerDto<OutputFindBillControllerDto>> {
      try {
         const { id, userId } = input.data;
         const bill = await this.findBillUseCase.execute({ id, userId });
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
         return response<OutputFindBillControllerDto>(
            200,
            'Bill founded successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
