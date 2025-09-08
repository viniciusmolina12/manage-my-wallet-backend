import { UserId } from '@core/domain/user/entity/user.entity';
import Entity from '../../@shared/entity.interface';
import EntityError from '../../@shared/error/entity.error';
import { Uuid } from '../../@shared/value-object/uuid.vo';
import { CategoryId } from '@core/domain/category/entity/category.entity';

export class ItemId extends Uuid {}

export default class Item extends Entity {
   private _id: ItemId;
   private _name: string;
   private _description?: string;
   private _categoryId: CategoryId;
   private _userId: UserId;

   constructor(
      id: ItemId,
      name: string,
      categoryId: CategoryId,
      userId: UserId,
      description?: string
   ) {
      super();
      this._id = id || new ItemId();
      this._name = name;
      this._categoryId = categoryId;
      this._description = description;
      this._userId = userId;
      this.validate();
   }

   validate() {
      if (!this._name) {
         this.notification.add({
            source: 'Item',
            message: 'Name is required',
         });
      }
      if (!(this._categoryId instanceof CategoryId)) {
         this.notification.add({
            source: 'Item',
            message: 'Category is required',
         });
      }
      if (!(this._userId instanceof UserId)) {
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
      return this._id.id;
   }
   get name(): string {
      return this._name;
   }
   get description(): string | undefined {
      return this?._description;
   }
   get categoryId(): string {
      return this._categoryId.id;
   }
   get userId(): UserId {
      return this._userId;
   }
}
