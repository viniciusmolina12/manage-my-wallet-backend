import Notification from "./notification";

export default abstract class Entity {
    protected notification: Notification;
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();
    constructor(createdAt?: Date, updatedAt?: Date){
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
        this.notification = new Notification();
    }
}