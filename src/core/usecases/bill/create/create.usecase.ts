import { v4 as uuid } from 'uuid';
import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import { InputCreateBillDto, OutputCreateBillDto } from './create.bill.dto';
import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';

export default class CreateBillUseCase {
   private readonly billRepository: BillRepository;

   constructor(billRepository: BillRepository) {
      this.billRepository = billRepository;
   }

   async execute(input: InputCreateBillDto): Promise<OutputCreateBillDto> {
      const billItems: BillItem[] = [];
      input?.items?.map((item) => {
         const billItem = new BillItem(
            uuid(),
            item.itemId,
            item.price,
            item.quantity
         );
         billItems.push(billItem);
      });
      const bill = new Bill(
         uuid(),
         input.name,
         billItems,
         new Date(),
         input.userId,
         input.description
      );
      await this.billRepository.create(bill);
      return {
         id: bill.id,
         createdDate: bill.createdDate,
         userId: bill.userId,
         name: bill.name,
         description: bill.description,
         total: bill.total,
         items: bill.items.map((item: BillItem) => ({
            id: item.id,
            itemId: item.itemId,
            price: item.price,
            quantity: item.quantity,
         })),
      };
   }
}
