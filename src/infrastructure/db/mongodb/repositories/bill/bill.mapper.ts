import BillItem from '@core/domain/bill/entity/bill-item.vo';
import Bill from '@core/domain/bill/entity/bill.entity';
import { ItemId } from '@core/domain/item/entity/item.entity';
import { BillId } from '@core/domain/bill/entity/bill.entity';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
export class BillMapper {
   static toDomain(model: any): Bill {
      const bill = new Bill(
         new BillId(model._id.toString()),
         model.name,
         model.date,
         model.items.map(
            (item: any) =>
               new BillItem(new ItemId(item.itemId), item.price, item.quantity)
         ),
         new VendorId(model.vendorId),
         new UserId(model.userId),
         model.description
      );
      bill.createdAt = model.createdAt;
      bill.updatedAt = model.updatedAt;
      return bill;
   }

   static toDomainList(model: any[]): Bill[] {
      return model.map((b) => this.toDomain(b));
   }
}
