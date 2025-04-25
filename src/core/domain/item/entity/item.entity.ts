import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';

export default class Item extends Entity {
   private _id: string;
   private _name: string;
   private _description?: string;
   private _categoryId: string;
   private _userId: string;

   constructor(
      id: string,
      name: string,
      categoryId: string,
      userId: string,
      description?: string
   ) {
      super();
      this._id = id;
      this._name = name;
      this._categoryId = categoryId;
      this._description = description;
      this._userId = userId;
      this.validate();
   }

   validate() {
      if (!this._id) {
         this.notification.add({
            source: 'Item',
            message: 'Id is required',
         });
      }
      if (!this._name) {
         this.notification.add({
            source: 'Item',
            message: 'Name is required',
         });
      }
      if (!this._categoryId) {
         this.notification.add({
            source: 'Item',
            message: 'Category is required',
         });
      }
      if (!this._userId) {
         this.notification.add({
            source: 'Item',
            message: 'User is required',
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
      return this?._description;
   }
   get categoryId(): string {
      return this._categoryId;
   }
   get userId(): string {
      return this._userId;
   }
}
