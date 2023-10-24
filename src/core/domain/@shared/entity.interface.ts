import Notification from "./notification";

export default abstract class Entity {
    protected notification: Notification;
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();
    constructor(){
        this.notification = new Notification();
    }
}