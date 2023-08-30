import Entity from "../../@shared/entity.interface";
import EntityError from "../../@shared/error/entity.error";

export default class BillItem extends Entity {
    private _id: string; 
    private _itemId: string;
    private _price: number;
    private _quantity: number;
    
    constructor(id: string, itemId: string, price: number, quantity: number) {
        super();
        this._id = id;
        this._itemId = itemId;
        this._price = price;
        this._quantity = quantity;
        this.validate();
    }

    validate(): void {
        if(this._id.length === 0) {
            this.notification.add({ message: 'Id is required', source: 'billItem' })
        }
        if(this._itemId.length === 0) {
            this.notification.add({ message: 'ItemId is required', source: 'billItem' })
        }
        if(this._price <= 0){
            this.notification.add({ message: 'Price must be greater than 0', source: 'billItem' })
        }
        if(this._quantity <= 0){
            this.notification.add({ message: 'Quantity must be greater than 0', source: 'billItem' })
        }

        if(this.notification.hasErrors()) {
            throw new EntityError(this.notification.getNotifications());
        }
    }
    get id(): string {
        return this._id;
    }
    get price(): number {
        return this._price;
    }
    get quantity(): number {
        return this._quantity;
    }

    get total(): number {
        return this._price * this._quantity;
    }

    changePrice(price: number): void {
        this._price = price;
        this.validate();
    }

    changeQuantity(quantity: number): void {
        this._quantity = quantity;
        this.validate();
    }
}