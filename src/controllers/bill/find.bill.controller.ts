import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import FindBillUseCase from '@core/usecases/bill/find/find.usecase';
import { Validator } from '@core/interfaces/validator.interface';

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
   vendorName: string;
   date: string;
   createdAt: Date;
   updatedAt: Date;
   items: {
      quantity: number;
      price: number;
      categoryId: string;
      categoryName: string;
      itemId: string;
      description?: string;
   }[];
}

export default class FindBillController {
   constructor(
      private readonly findBillUseCase: FindBillUseCase,
      private readonly validator: Validator
   ) {
      this.findBillUseCase = findBillUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputFindBillControllerDto>
   ): Promise<OutputControllerDto<OutputFindBillControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { id, userId } = input.data;
         const bill = await this.findBillUseCase.execute({ id, userId });
         const output = {
            id: bill.id,
            name: bill.name,
            description: bill.description,
            total: bill.total,
            vendorId: bill.vendorId,
            vendorName: bill.vendorName,
            date: bill.date.toISOString().split('T')[0],
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            items: bill.items.map((item) => ({
               quantity: item.quantity,
               price: item.price,
               itemId: item.id,
               categoryId: item.categoryId,
               categoryName: item.categoryName,
               description: item.description,
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
