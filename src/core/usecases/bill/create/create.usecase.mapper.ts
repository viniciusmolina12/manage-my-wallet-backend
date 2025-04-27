import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';
import { OutputCreateBillDto } from './create.bill.dto';

export default class CreateBillUseCaseMapper {
   static toOutput(entity: Bill): OutputCreateBillDto {
      return {
         id: entity.id,
         createdDate: entity.createdDate,
         userId: entity.userId,
         vendorId: entity.vendorId,
         name: entity.name,
         description: entity.description,
         total: entity.total,
         items: entity.items.map((item: BillItem) => ({
            id: item.id,
            itemId: item.itemId,
            price: item.price,
            quantity: item.quantity,
         })),
      };
   }
}
