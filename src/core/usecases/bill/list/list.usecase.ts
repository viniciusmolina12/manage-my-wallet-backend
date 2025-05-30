import {
   BillRepository,
   SearchBill,
} from '@core/domain/bill/repository/bill.repository';
import { InputListBillDto, OutputListBillDto } from './list.bill.dto';
import { Filter } from '@core/domain/@shared/filter/filter';

export default class ListBillUseCase {
   private readonly billRepository: BillRepository;
   constructor(billRepository: BillRepository) {
      this.billRepository = billRepository;
   }

   async execute(
      input: InputListBillDto,
      filter: Filter<SearchBill>
   ): Promise<OutputListBillDto> {
      const { userId } = input;
      const result = await this.billRepository.findAllByUser(userId, filter);
      const { data, ...meta } = result;
      const output = data.map((bill) => ({
         id: bill.id,
         description: bill.description,
         name: bill.name,
         vendorId: bill.vendorId,
         total: bill.total,
         createdAt: bill.createdAt,
         updatedAt: bill.updatedAt,
         date: bill.date,
         items: bill.items.map((item) => ({
            id: item.id,
            itemId: item.itemId,
            price: item.price,
            quantity: item.quantity,
         })),
      }));
      return { bills: output, meta };
   }
}
