import EntityError from '@core/domain/@shared/error/entity.error';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import ListBillUseCase from '@core/usecases/bill/list/list.usecase';
import { Filter } from '@core/domain/@shared/filter/filter';
import { SearchBill } from '@core/domain/bill/repository/bill.repository';
import { Validator } from '@core/interfaces/validator.interface';
interface InputListBillControllerDto {
   userId: string;
   page: number;
   perPage: number;
   order: string;
   search: SearchBill;
}

interface OutputListBillControllerDto {
   total: number;
   bills: {
      id: string;
      name: string;
      description?: string;
      total: number;
      date: string;
      vendorId: string;
      createdAt: Date;
      updatedAt: Date;
      items: {
         quantity: number;
         price: number;
         itemId: string;
         categoryId: string;
         categoryName: string;
         description?: string;
      }[];
   }[];
}

export default class ListBillController {
   constructor(
      private readonly listBillUseCase: ListBillUseCase,
      private readonly validator: Validator
   ) {
      this.listBillUseCase = listBillUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputListBillControllerDto>
   ): Promise<OutputControllerDto<OutputListBillControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const filter = new Filter(
            input.data.page,
            input.data.perPage,
            input.data.order,
            input.data.search
         );
         const bills = await this.listBillUseCase.execute(input.data, filter);
         const output = {
            total: bills.total,
            bills: bills.bills.map((bill) => ({
               id: bill.id,
               name: bill.name,
               description: bill.description,
               total: bill.total,
               vendorId: bill.vendorId,
               date: bill.date.toISOString().split('T')[0],
               createdAt: bill.createdAt,
               updatedAt: bill.updatedAt,
               items: bill.items.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  itemId: item.itemId,
                  categoryId: item.categoryId,
                  categoryName: item.categoryName,
                  description: item.description,
               })),
            })),
            meta: {
               total: bills.meta.total,
               hasNext: bills.meta.hasNext,
               page: bills.meta.page ? bills.meta.page : 1,
               perPage: bills.meta.perPage ? bills.meta.perPage : 10,
            },
         };
         return response<OutputListBillControllerDto>(
            200,
            'Bills listed successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
