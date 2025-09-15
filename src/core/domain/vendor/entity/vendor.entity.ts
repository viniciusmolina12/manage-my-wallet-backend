import { UserId } from '@core/domain/user/entity/user.entity';
import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';
import { Uuid } from '../../@shared/value-object/uuid.vo';

export class VendorId extends Uuid {}

export default class Vendor extends Entity {
   private _id: VendorId;
   private _name: string;
   private _userId: UserId;

   constructor(id: VendorId, name: string, userId: UserId) {
      super();
      this._id = id || new VendorId();
      this._name = name;
      this._userId = userId;
      this.validate();
   }

   validate() {
      if (this._name.length === 0) {
         this.notification.add({
            message: 'Name is required',
            source: 'vendor',
         });
      }
      if (!(this._userId instanceof UserId)) {
         this.notification.add({
            message: 'User ID is required',
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
      return this._id.id;
   }
   get name(): string {
      return this._name;
   }
   get userId(): string {
      return this._userId.id;
   }
}
