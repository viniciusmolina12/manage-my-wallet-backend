import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';

export default class Vendor extends Entity {
   private _id: string;
   private _name: string;

   constructor(id: string, name: string) {
      super();
      this._id = id;
      this._name = name;
      this.validate();
   }

   validate() {
      if (this._id.length === 0) {
         this.notification.add({
            message: 'Id is required',
            source: 'vendor',
         });
      }
      if (this._name.length === 0) {
         this.notification.add({
            message: 'Name is required',
            source: 'vendor',
         });
      }
      if (this.notification.hasErrors()) {
         throw new EntityError(this.notification.getNotifications());
      }
   }

   changeName(name: string): void {
      this._name = name;
      this.validate();
   }

   get id(): string {
      return this._id;
   }
   get name(): string {
      return this._name;
   }
}
