import EntityError from '@core/domain/@shared/error/entity.error';
import CreateBillUseCase from '@core/usecases/bill/create/create.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import FindBillUseCase from '@core/usecases/bill/find/find.usecase';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputCreateBillControllerDto {
   name: string;
   description?: string;
   userId: string;
   vendorId: string;
   date: Date;
   items: {
      quantity: number;
      price: number;
      itemId: string;
   }[];
}

interface OutputCreateBillControllerDto {
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
      id: string;
      name: string;
      description?: string;
      price: number;
      quantity: number;
      categoryId: string;
      categoryName: string;
   }[];
}

export default class CreateBillController {
   constructor(
      private readonly createBillUseCase: CreateBillUseCase,
      private readonly findBillUseCase: FindBillUseCase,
      private readonly validator: Validator
   ) {
      this.createBillUseCase = createBillUseCase;
      this.findBillUseCase = findBillUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputCreateBillControllerDto>
   ): Promise<OutputControllerDto<OutputCreateBillControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors.join(', '));
         const { id } = await this.createBillUseCase.execute(input.data);
         const bill = await this.findBillUseCase.execute({
            id,
            userId: input.data.userId,
         });
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
               id: item.id,
               name: item.name,
               description: item.description,
               price: item.price,
               quantity: item.quantity,
               categoryId: item.categoryId,
               categoryName: item.categoryName,
            })),
         };
         return response<OutputCreateBillControllerDto>(
            201,
            'Bill created successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
