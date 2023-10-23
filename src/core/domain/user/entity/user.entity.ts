import Entity from "@core/domain/@shared/entity.interface";
import EntityError from "@core/domain/@shared/error/entity.error";

export default class User extends Entity {
    private id: string;
    private name: string;
    private email: string;
    private userName: string;
    private password: string;
    constructor(id: string, name: string, email: string, userName: string, password: string) {
        super();
        this.id = id;
        this.name = name;
        this.email = email;
        this.userName = userName;
        this.password = password;
        this.validate();
    }

    validate() {
        if(!this.id) {
            this.notification.add({ message: 'Id is required', source: 'user'})
        }
        if(!this.name) {
            this.notification.add({ message: 'Name is required', source: 'user'})
        }
        if(!this.email){
            this.notification.add({ message: 'Email is required', source: 'user'})
        }
        if(!this.userName){
            this.notification.add({ message: 'Username is required', source: 'user'})
        }
        if(!this.password){
            this.notification.add({ message: 'Password is required', source: 'user'})
        }
        if(this.notification.hasErrors()) {
            throw new EntityError(this.notification.getNotifications());
        }
    }

   set changeName(name: string) {
    this.name = name;
    this.validate();
   }

   set changeEmail(email: string) {
    this.email = email;
    this.validate();
   }

   set changeUsername(userName: string) {
    this.userName = userName;
    this.validate();
   }

   set changePassword(password: string) {
    this.password = password;
    this.validate();
   }
}   