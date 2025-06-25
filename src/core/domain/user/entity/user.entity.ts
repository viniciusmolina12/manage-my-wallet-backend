import Entity from '@core/domain/@shared/entity.interface';
import EntityError from '@core/domain/@shared/error/entity.error';
import { Email } from '@core/domain/@shared/value-object/email.vo';

export default class User extends Entity {
   public _id: string;
   private _name: string;
   private _email: Email;
   private _password: string;
   constructor(
      id: string,
      name: string,
      email: Email,
      password: string,
      createdAt?: Date,
      updatedAt?: Date
   ) {
      super(createdAt, updatedAt);
      this._id = id;
      this._name = name;
      this._email = email;
      this._password = password;
      this.validate();
   }

   validate() {
      if (!this._id) {
         this.notification.add({
            message: 'Id is required',
            source: 'user',
         });
      }
      if (!this._name) {
         this.notification.add({
            message: 'Name is required',
            source: 'user',
         });
      }
      if (!this._password) {
         this.notification.add({
            message: 'Password is required',
            source: 'user',
         });
      }
      if (this.notification.hasErrors()) {
         throw new EntityError(this.notification.getNotifications());
      }
   }

   changeName(name: string) {
      this._name = name;
      this.validate();
   }

   changeEmail(email: Email) {
      this._email = email;
      this.validate();
   }
   changePassword(password: string) {
      this._password = password;
      this.validate();
   }

   get id(): string {
      return this._id;
   }

   get email(): Email {
      return this._email;
   }

   get password(): string {
      return this._password;
   }

   get name(): string {
      return this._name;
   }
}
