export default class Vendor { 
    private _id: string;
    private _name: string;
    private _categoryId: string;

    constructor(id: string, name: string, categoryId: string) {
        this._id = id;
        this._name = name;
        this._categoryId = categoryId;
        this.validate();
    }

    validate() {
        if(this._id.length === 0){
            throw new Error('Id is required')
        }
        if(this._name.length === 0){
            throw new Error('Name is required')
        }
        if(this._categoryId.length === 0){
            throw new Error('CategoryId is required')
        }
    }

    changeName(name: string): void {
        this._name = name;
        this.validate();
    }
    changeCategory(categoryId: string): void {
        this._categoryId = categoryId;
        this.validate();
    }

    get id(): string {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
    get categoryId(): string {
        return this._categoryId;
    }
}