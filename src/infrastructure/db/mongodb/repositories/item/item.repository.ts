import Item from '../../../../../core/domain/item/entity/item.entity';
import { ItemRepository } from '../../../../../core/domain/item/repository/item.repository';
import ItemModel from '../../model/item.model';

export default class MongoDbItemRepository implements ItemRepository {
   async create(entity: Item): Promise<void> {
      await ItemModel.create({
         _id: entity.id,
         name: entity.name,
         userId: entity.userId,
         categoryId: entity.categoryId,
         description: entity.description,
      });
   }
   async update(entity: Item): Promise<void> {
      await ItemModel.findOneAndUpdate(
         { _id: entity.id },
         {
            name: entity.name,
            categoryId: entity.categoryId,
            description: entity.description,
         }
      );
   }

   async find(id: string): Promise<Item | null> {
      const result = await ItemModel.findOne({ _id: id });
      if (!result) return null;
      return new Item(
         result._id.toString(),
         result.name,
         result.categoryId,
         result.userId,
         result?.description
      );
   }

   async findByUser(id: string, userId: string): Promise<Item | null> {
      const result = await ItemModel.findOne({ _id: id, userId });
      if (!result) return null;
      return new Item(
         result._id.toString(),
         result.name,
         result.categoryId,
         result.userId,
         result?.description
      );
   }

   async findByName(name: string, userId: string): Promise<Item | null> {
      const result = await ItemModel.findOne({ name, userId });
      if (!result) return null;
      return new Item(
         result._id.toString(),
         result.name,
         result.categoryId,
         result.userId,
         result?.description
      );
   }

   async findAll(): Promise<Item[]> {
      const result = await ItemModel.find();
      return result.map(
         (item) =>
            new Item(
               item._id.toString(),
               item.name,
               item.categoryId,
               item.userId,
               item?.description
            )
      );
   }

   async findAllByUserId(userId: string): Promise<Item[]> {
      const result = await ItemModel.find({ userId });
      return result.map(
         (item) =>
            new Item(
               item._id.toString(),
               item.name,
               item.categoryId,
               item.userId,
               item?.description
            )
      );
   }

   async delete(id: string): Promise<void> {
      await ItemModel.findByIdAndDelete({ _id: id });
   }

   async deleteByUser(id: string, userId: string): Promise<void> {
      await ItemModel.deleteMany({ _id: id, userId });
   }
}
