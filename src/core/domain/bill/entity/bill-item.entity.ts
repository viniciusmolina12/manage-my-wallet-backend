import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';

export default class BillItem extends Entity {
   private _id: string;
   public itemId: string;
   public price: number;
   public quantity: number;

   constructor(id: string, itemId: string, price: number, quantity: number) {
      super();
      this._id = id;
      this.itemId = itemId;
      this.price = price;
      this.quantity = quantity;
      this.validate();
   }

   validate(): void {
      if (!this._id) {
         this.notification.add({
            message: 'Id is required',
            source: 'billItem',
         });
      }
      if (!this.itemId) {
         this.notification.add({
            message: 'ItemId is required',
            source: 'billItem',
         });
      }
      if (this.price <= 0) {
         this.notification.add({
            message: 'Price must be greater than 0',
            source: 'billItem',
         });
      }
      if (this.quantity <= 0) {
         this.notification.add({
            message: 'Quantity must be greater than 0',
            source: 'billItem',
         });
      }

      if (this.notification.hasErrors()) {
         throw new EntityError(this.notification.getNotifications());
      }
   }
   get id(): string {
      return this._id;
   }

   get total(): number {
      return this.price * this.quantity;
   }

   changePrice(price: number): void {
      this.price = price;
      this.validate();
   }

   changeQuantity(quantity: number): void {
      this.quantity = quantity;
      this.validate();
   }
}
