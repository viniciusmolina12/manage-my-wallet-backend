import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';
import Item from '@core/domain/item/entity/item.entity';
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
      const item = new Item(
         model.itemId.itemId,
         model.itemId.name,
         model.itemId.categoryId,
         model.itemId.userId
      );
      return new BillItem(model._id, item, model.price, model.quantity);
   }
}
