export default class Vendor { 
    private _id: string;
    private _name: string;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
    }

    validate() {
        if(this._id.length === 0){
            throw new Error('Id is required')
        }
        if(this._name.length === 0){
            throw new Error('Name is required')
        }
    }

    changeName(name: string): void {
        this._name = name;
        this.validate();
    }

    get id(): string {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
}