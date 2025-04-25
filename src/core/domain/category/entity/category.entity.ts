import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';

export default class Category extends Entity {
   private _id: string;
   private _name: string;
   private _description?: string;
   private _userId: string;

   constructor(id: string, name: string, userId: string, description?: string) {
      super();
      this._id = id;
      this._name = name;
      this._description = description;
      this._userId = userId;
      this.validate();
   }

   validate() {
      if (!this._id) {
         this.notification.add({
            message: 'Id is required',
            source: 'category',
         });
      }
      if (!this._name) {
         this.notification.add({
            message: 'Name is required',
            source: 'category',
         });
      }
      if (!this._userId) {
         this.notification.add({
            message: 'User is required',
            source: 'category',
         });
      }
      if (this.notification.hasErrors()) {
         throw new EntityError(this.notification.getNotifications());
      }
   }

   get id(): string {
      return this._id;
   }
   get name(): string {
      return this._name;
   }
   get description(): string | undefined {
      return this._description;
   }
   get userId(): string {
      return this._userId;
   }
}
