import Entity from "@core/domain/@shared/entity.interface";
import EntityError from "@core/domain/@shared/error/entity.error";
import { EmailValidate } from "@core/domain/@shared/validate/email.validate";

export default class User extends Entity {
    private _id: string;
    private _name: string;
    private _email: string;
    private _password: string;
    constructor(id: string, name: string, email: string, password: string, createdAt?: Date, updatedAt?: Date) {
        super(createdAt, updatedAt);
        this._id = id;
        this._name = name;
        this._email = email;
        this._password = password;
        this.validate();
    }

    validate() {
        if(!this._id) {
            this.notification.add({ message: 'Id is required', source: 'user'})
        }
        if(!this._name) {
            this.notification.add({ message: 'Name is required', source: 'user'})
        }
        if(!this._email){
            this.notification.add({ message: 'Email is required', source: 'user'})
        }
        if(!EmailValidate.validate(this._email)) {
            this.notification.add({ message: 'Email is invalid', source: 'user'})
        }
        if(!this._password){
            this.notification.add({ message: 'Password is required', source: 'user'})
        }
        if(this.notification.hasErrors()) {
            throw new EntityError(this.notification.getNotifications());
        }
    }

    changeName(name: string) {
    this._name = name;
    this.validate();
   }

    changeEmail(email: string) {
    this._email = email;
    this.validate();
   }
    changePassword(password: string) {
    this._password = password;
    this.validate();
   }

   get id(): string { 
    return this._id
   }

   get email(): string { 
    return this._email
   }

   get password(): string { 
    return this._password
   }

   get name(): string {
    return this._name
   }
}   