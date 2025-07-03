import Bill from '@core/domain/bill/entity/bill.entity';
import { OutputSummaryBillDto } from './summary.bill.dto';
import BillItem from '@core/domain/bill/entity/bill-item.entity';

export class SummaryBillUseCaseMapper {
   static toOutput(entity: Bill[]): OutputSummaryBillDto {
      return {
         bills: entity.map((bill) => ({
            id: bill.id,
            name: bill.name,
            vendorId: bill.vendorId,
            total: bill.total,
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            date: bill.date,
            description: bill?.description,
            items: bill.items.map((item: BillItem) => ({
               id: item.id,
               itemId: item.itemId,
               price: item.price,
               quantity: item.quantity,
            })),
         })),
      };
   }
}
