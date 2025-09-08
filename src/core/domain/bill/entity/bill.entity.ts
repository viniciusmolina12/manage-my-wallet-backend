import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';
import BillItem from './bill-item.vo';
import { Uuid } from '../../@shared/value-object/uuid.vo';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
import { BillBuilder } from './bill.builder';

export class BillId extends Uuid {}

export default class Bill extends Entity {
   private _id: BillId;
   public name: string;
   private _items: BillItem[];
   public date: Date;
   public description?: string;
   public userId: UserId;
   public vendorId: VendorId;

   constructor(
      id: BillId,
      name: string,
      date: Date,
      items: BillItem[],
      vendorId: VendorId,
      userId: UserId,
      description?: string
   ) {
      super();
      this._id = id || new BillId();
      this.name = name;
      this.date = new Date(date);
      this._items = items;
      this.vendorId = vendorId;
      this.description = description;
      this.userId = userId;
      this.validate();
   }

   get items(): ReadonlyArray<BillItem> {
      return this._items;
   }

   validate() {
      if (!this.name) {
         this.notification.add({
            message: 'Name is required',
            source: 'bill',
         });
      }
      if (!this.date) {
         this.notification.add({
            message: 'Date is required',
            source: 'bill',
         });
      }
      if (!this.items || this.items?.length === 0) {
         this.notification.add({
            message: 'Items is required',
            source: 'bill',
         });
      }

      if (!this.vendorId?.id) {
         this.notification.add({
            message: 'VendorId is required',
            source: 'bill',
         });
      }
      if (this.notification.hasErrors()) {
         throw new EntityError(this.notification.getNotifications());
      }
   }

   get total(): number {
      return Array.from(this.items.values()).reduce(
         (acc, item) => acc + item.total,
         0
      );
   }

   get vendor(): string {
      return this.vendorId.id;
   }

   get id(): string {
      return this._id.id;
   }

   changeName(name: string): void {
      this.name = name;
      this.validate();
   }

   changeDate(date: Date): void {
      this.date = date;
      this.validate();
   }

   changeDescription(description: string): void {
      this.description = description;
   }

   changeVendor(vendorId: VendorId) {
      this.vendorId = vendorId;
      this.validate();
   }

   replaceItems(items: BillItem[]): void {
      this._items = items;
      this.validate();
   }

   static fake(): BillBuilder {
      return new BillBuilder();
   }
}
