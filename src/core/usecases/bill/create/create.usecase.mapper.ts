import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';
import { OutputCreateBillDto } from './create.bill.dto';

export default class CreateBillUseCaseMapper {
   static toOutput(entity: Bill): OutputCreateBillDto {
      return {
         id: entity.id,
         userId: entity.userId,
         vendorId: entity.vendorId,
         name: entity.name,
         date: entity.date,
         description: entity.description,
         total: entity.total,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         items: entity.items.map((item: BillItem) => ({
            id: item.id,
            itemId: item.itemId,
            price: item.price,
            quantity: item.quantity,
         })),
      };
   }
}
