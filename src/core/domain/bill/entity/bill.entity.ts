import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';
import BillItem from './bill-item.entity';

export default class Bill extends Entity {
   public id: string;
   public name: string;
   public items: BillItem[];
   public description?: string;
   public createdDate: Date;

   constructor(
      id: string,
      name: string,
      items: BillItem[],
      createdDate: Date,
      description?: string
   ) {
      super();
      this.id = id;
      this.name = name;
      this.items = items;
      this.description = description;
      this.createdDate = createdDate;
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
      if (this.notification.hasErrors()) {
         throw new EntityError(this.notification.getNotifications());
      }
   }

   get total(): number {
      return this.items.reduce((acc, item) => acc + item.total, 0);
   }

   changeName(name: string): void {
      this.name = name;
      this.validate();
   }

   changeDescription(description: string): void {
      this.description = description;
   }
}
