import EntityError from '@core/domain/@shared/error/entity.error';
import CreateBillUseCase from '@core/usecases/bill/create/create.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import FindBillUseCase from '@core/usecases/bill/find/find.usecase';

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
      private readonly findBillUseCase: FindBillUseCase
   ) {
      this.createBillUseCase = createBillUseCase;
   }
   public async handle(
      input: InputControllerDto<InputCreateBillControllerDto>
   ): Promise<OutputControllerDto<OutputCreateBillControllerDto>> {
      try {
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
