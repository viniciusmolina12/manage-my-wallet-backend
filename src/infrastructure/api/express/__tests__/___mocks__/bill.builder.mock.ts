import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';
import BillModel from '@infrastructure/db/mongodb/model/bill.model';

export class BillBuilder {
   private bill: Bill;
   constructor() {
      this.bill = new Bill(
         'any_hash_id',
         'any_name',
         new Date(),
         [new BillItem('any_item_id', 'any_item_id', 10, 1)],
         'any_vendor_id',
         'any_user_id',
         'any_description'
      );
   }
   public withId(id: string): BillBuilder {
      this.bill.id = id;
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
   public withVendorId(vendorId: string): BillBuilder {
      this.bill.vendorId = vendorId;
      return this;
   }
   public withUserId(userId: string): BillBuilder {
      this.bill.userId = userId;
      return this;
   }
   public withDate(date: Date): BillBuilder {
      this.bill.date = date;
      return this;
   }
   public withItems(items: BillItem[]): BillBuilder {
      this.bill.items = items;
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
            _id: item.id,
            quantity: item.quantity,
            price: item.price,
            itemId: item.itemId,
         })),
      });
   }
}
