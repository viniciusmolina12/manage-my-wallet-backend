import BillItem from '@core/domain/bill/entity/bill-item.vo';
import { ItemId } from '@core/domain/item/entity/item.entity';
import Bill, { BillId } from '@core/domain/bill/entity/bill.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import BillModel from '@infrastructure/db/mongodb/model/bill.model';

export class BillBuilder {
   public id: BillId | undefined = undefined;
   public name: string | undefined = undefined;
   private _items: BillItem[] | undefined = undefined;
   public date: Date | undefined = undefined;
   public description?: string | undefined = undefined;
   public userId: UserId | undefined = undefined;
   public vendorId: VendorId | undefined = undefined;

   public withId(id?: BillId): BillBuilder {
      this.id = id || new BillId();
      return this;
   }
   public withName(name: string): BillBuilder {
      this.name = name;
      return this;
   }
   public withDescription(description: string): BillBuilder {
      this.description = description;
      return this;
   }
   public withVendorId(vendorId?: VendorId): BillBuilder {
      this.vendorId = vendorId || new VendorId();
      return this;
   }
   public withUserId(userId?: UserId): BillBuilder {
      this.userId = userId || new UserId();
      return this;
   }
   public withDate(date: Date): BillBuilder {
      this.date = date;
      return this;
   }
   public withMakeItems(
      info: { price: number; quantity: number },
      count: number = 1
   ): BillBuilder {
      this._items = Array.from(
         { length: count },
         () => new BillItem(new ItemId(), info.price, info.quantity)
      );
      return this;
   }

   public withItems(items: BillItem[]): BillBuilder {
      this._items = items;
      return this;
   }
   public build(): Bill {
      return new Bill(
         this.id as BillId,
         this.name as string,
         this.date as Date,
         this._items as BillItem[],
         this.vendorId as VendorId,
         this.userId as UserId,
         this.description
      );
   }
   //TODO: REMOVER ESTES METODOS
   public async buildAndCreateModel(): Promise<Bill> {
      const bill = this.build();
      await this.createModel(bill);
      return bill;
   }

   public async createModel(bill: Bill): Promise<void> {
      await BillModel.create({
         _id: bill.id,
         name: bill.name,
         userId: bill.userId,
         vendorId: bill.vendorId,
         description: bill.description,
         date: bill.date,
         total: bill.total,
         items: bill.items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            itemId: item.itemId,
         })),
      });
   }
   //
}
