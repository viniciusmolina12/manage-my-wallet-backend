import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';
export class BillMapper {
   static toDomain(model: any): Bill {
      return new Bill(
         model._id.toString(),
         model.name,
         model.date,
         model.items.map((item: any) => BillItemMapper.toDomain(item)),
         model.vendorId,
         model.userId,
         model.description
      );
   }

   static toDomainList(model: any[]): Bill[] {
      return model.map((b) => this.toDomain(b));
   }
}

class BillItemMapper {
   static toDomain(model: any): BillItem {
      return new BillItem(model._id, model.itemId, model.price, model.quantity);
   }
}
