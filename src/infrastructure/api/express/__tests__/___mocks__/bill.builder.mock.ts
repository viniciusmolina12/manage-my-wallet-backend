import BillItem from '@core/domain/bill/entity/bill-item.vo';
import Bill, { BillId } from '@core/domain/bill/entity/bill.entity';
import { ItemId } from '@core/domain/item/entity/item.entity';
import BillModel from '@infrastructure/db/mongodb/model/bill.model';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';

export class BillBuilder {
   private bill: Bill;
   constructor() {
      this.bill = new Bill(
         new BillId(),
         'any_name',
         new Date(),
         [new BillItem(new ItemId(), 10, 1)],
         new VendorId(),
         new UserId(),
         'any_description'
      );
   }
   public withId(id: string): BillBuilder {
      this.bill['_id'] = new BillId(id);
      return this;
   }
   public withName(name: string): BillBuilder {
      this.bill.name = name;
      return this;
   }
   public withDescription(description: string): BillBuilder {
      this.bill.description = description;
      return this;
   }
   public withVendorId(vendorId: VendorId): BillBuilder {
      this.bill.vendorId = vendorId;
      return this;
   }
   public withUserId(userId: UserId): BillBuilder {
      this.bill.userId = userId;
      return this;
   }
   public withDate(date: Date): BillBuilder {
      this.bill.date = date;
      return this;
   }
   public withItems(items: BillItem[]): BillBuilder {
      this.bill['_items'] = items;
      return this;
   }
   public build(): Bill {
      return this.bill;
   }

   public async buildAndCreateModel(): Promise<Bill> {
      await this.createModel();
      return this.bill;
   }

   public async createModel(): Promise<void> {
      await BillModel.create({
         _id: this.bill.id,
         name: this.bill.name,
         userId: this.bill.userId,
         vendorId: this.bill.vendorId,
         description: this.bill.description,
         date: this.bill.date,
         total: this.bill.total,
         items: this.bill.items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            itemId: item.itemId,
         })),
      });
   }
}
