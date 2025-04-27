import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';
import BillItem from './bill-item.entity';

export default class Bill extends Entity {
   public id: string;
   public name: string;
   public items: BillItem[];
   public description?: string;
   public createdDate: Date;
   public userId: string;
   public vendorId: string;
   constructor(
      id: string,
      name: string,
      items: BillItem[],
      vendorId: string,
      createdDate: Date,
      userId: string,
      description?: string
   ) {
      super();
      this.id = id;
      this.name = name;
      this.items = items;
      this.vendorId = vendorId;
      this.description = description;
      this.createdDate = createdDate;
      this.userId = userId;
      this.validate();
   }

   validate() {
      if (!this.id) {
         this.notification.add({
            message: 'Id is required',
            source: 'bill',
         });
      }
      if (!this.name) {
         this.notification.add({
            message: 'Name is required',
            source: 'bill',
         });
      }
      if (!this.items || this.items?.length === 0) {
         this.notification.add({
            message: 'Items is required',
            source: 'bill',
         });
      }
      if (!this.createdDate) {
         this.notification.add({
            message: 'Created Date is required',
            source: 'bill',
         });
      }
      if (!this.vendorId) {
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
      return this.items.reduce((acc, item) => acc + item.total, 0);
   }

   get vendor(): string {
      return this.vendorId;
   }

   changeName(name: string): void {
      this.name = name;
      this.validate();
   }

   changeDescription(description: string): void {
      this.description = description;
   }
}
