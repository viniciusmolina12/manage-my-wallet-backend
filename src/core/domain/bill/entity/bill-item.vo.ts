import { ValueObject } from '@core/domain/@shared/value-object.interface';
import EntityError from '../../@shared/error/entity.error';
import { ItemId } from '@core/domain/item/entity/item.entity';

export default class BillItem extends ValueObject {
   public itemId: ItemId;
   public price: number;
   public quantity: number;

   constructor(item: ItemId, price: number, quantity: number) {
      super();
      this.itemId = item;
      this.price = price;
      this.quantity = quantity;
      this.validate();
   }

   validate(): void {
      if (!this.itemId) {
         this.notification.add({
            message: 'Item is required',
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
