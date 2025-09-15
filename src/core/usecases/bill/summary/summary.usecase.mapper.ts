import Bill from '@core/domain/bill/entity/bill.entity';
import { OutputSummaryBillDto } from './summary.bill.dto';
import BillItem from '@core/domain/bill/entity/bill-item.vo';

export class SummaryBillUseCaseMapper {
   static toOutput(entity: Bill[]): OutputSummaryBillDto {
      return {
         bills: entity.map((bill) => ({
            id: bill.id,
            name: bill.name,
            vendorId: bill.vendorId.id,
            total: bill.total,
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            date: bill.date,
            description: bill?.description,
            items: bill.items.map((item: BillItem) => ({
               itemId: item.itemId.id,
               price: item.price,
               quantity: item.quantity,
            })),
         })),
      };
   }
}
