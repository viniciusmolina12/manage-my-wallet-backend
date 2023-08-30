import Entity from "../../@shared/entity.interface";
import EntityError from "../../@shared/error/entity.error";
import BillItem from "./bill-item.entity";

export default class Bill extends Entity {
    private _id: string;
    private _name: string;
    private _total: number = 0;
    private _items: BillItem[];
    private _description?: string;

    constructor(id: string, name: string, items: BillItem[], description?: string) {
        super();
        this._id = id;
        this._name = name;
        this._items = items;
        this._description = description;
        this.validate();
    }

    validate() {
        if(this._id.length === 0) {
            this.notification.add({ message: 'Id is required', source: 'bill'})
        }
        if(this._name.length === 0) {
            this.notification.add({ message: 'Name is required', source: 'bill'})
        }
        if(this._items.length === 0){
            this.notification.add({ message: 'Items is required', source: 'bill'})
        }
        if(this.notification.hasErrors()) {
            throw new EntityError(this.notification.getNotifications());
        }
    }

    get total(): number {
        return this._items.reduce((acc, item) => acc + item.total, 0)
    } 
    
    get name(): string {
        return this._name;
    }

    get description(): string | undefined {
        return this._description;
    }

    changeName(name: string): void {
        this._name = name;
        this.validate();
    }

    changeDescription(description: string): void {
        this._description = description;
    }

}