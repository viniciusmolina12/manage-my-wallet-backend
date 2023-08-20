export default class Category {
    private _id: string;
    private _name: string;
    private _description: string;

    constructor(id: string, name: string, description: string) {
        this._id = id;
        this._name = name;
        this._description = description;
        this.validate();
    }


    validate() {
        if(!this._id) {
            throw new Error('Id is required')
        }
        if(!this._name) {
            throw new Error('Name is required')
        }
    }

    get id (): string {
        return this._id;
    }
    get name (): string {
        return this._name;
    }
    get description (): string {
        return this._description;
    }

}