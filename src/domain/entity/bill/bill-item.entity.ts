export default class BillItem {
    private _id: string;
    private _itemId: string;
    private _price: number;
    private _quantity: number;
    
    constructor(id: string, itemId: string, price: number, quantity: number) {
        this._id = id;
        this._itemId = itemId;
        this._price = price;
        this._quantity = quantity;
        this.validate();
    }

    validate(): void {
        if(this._id.length === 0) {
            throw new Error('Id is required');
        }
        if(this._itemId.length === 0) {
            throw new Error('ItemId is required');
        }
        if(this._price <= 0){
            throw new Error('Price must be greater than 0');
        }
        if(this._quantity <= 0){
            throw new Error('Quantity must be greater than 0');
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