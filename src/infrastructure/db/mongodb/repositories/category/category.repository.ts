import Category from "@core/domain/category/entity/category.entity";
import { CategoryRepository } from "@core/domain/category/repository/category.repository";
import CategoryModel from "../../model/category.model";


export default class MongoDbCategoryRepository implements CategoryRepository { 
    async create(entity: Category): Promise<void> {
        await CategoryModel.create({_id: entity.id, name: entity.name, description: entity.description});
    }
    async update(entity: Category): Promise<void> {
        await CategoryModel.findOneAndUpdate({ _id: entity.id }, { name: entity.name, description: entity.description });
    }

    async find(id: string): Promise<Category | null> {
        const result = await CategoryModel.findOne({ _id: id });
        if(!result) return null
        return new Category(result._id.toString(), result.name, result?.description)
    }

    async findAll(): Promise<Category[]> {
        const result = await CategoryModel.find();
        return result.map(category => new Category(category._id.toString(), category.name, category?.description))
    }

    async delete(id: string): Promise<void> {
        await CategoryModel.findByIdAndDelete({ _id: id });
    }

    async findCategoryByName(name: string): Promise<Category | undefined> {
        const result = await CategoryModel.findOne({ name: name });
        if(!result) return undefined;
        return new Category(result._id.toString(), result.name, result?.description)
    }
}
