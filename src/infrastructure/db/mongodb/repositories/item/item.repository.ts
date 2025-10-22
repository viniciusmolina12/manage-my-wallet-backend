import { CategoryId } from '@core/domain/category/entity/category.entity';
import Item, {
   ItemId,
} from '../../../../../core/domain/item/entity/item.entity';
import {
   ItemRepository,
   SearchItem,
} from '../../../../../core/domain/item/repository/item.repository';
import ItemModel from '../../model/item.model';
import { UserId } from '@core/domain/user/entity/user.entity';
import { Filter, Pagination } from '@core/domain/@shared/filter/filter';

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
            updatedAt: new Date(),
         }
      );
   }

   async find(id: string): Promise<Item | null> {
      const result = await ItemModel.findOne({ _id: id });
      if (!result) return null;
      const item = new Item(
         new ItemId(result._id.toString()),
         result.name,
         new CategoryId(result.categoryId),
         new UserId(result.userId),
         result?.description
      );
      item.createdAt = result.createdAt;
      item.updatedAt = result.updatedAt;
      return item;
   }

   async findByUser(id: string, userId: string): Promise<Item | null> {
      const result = await ItemModel.findOne({ _id: id, userId });
      if (!result) return null;
      const item = new Item(
         new ItemId(result._id.toString()),
         result.name,
         new CategoryId(result.categoryId),
         new UserId(result.userId),
         result?.description
      );
      item.createdAt = result.createdAt;
      item.updatedAt = result.updatedAt;
      return item;
   }

   async findByName(name: string, userId: string): Promise<Item | null> {
      const result = await ItemModel.findOne({ name, userId });
      if (!result) return null;
      return new Item(
         new ItemId(result._id.toString()),
         result.name,
         new CategoryId(result.categoryId),
         new UserId(result.userId),
         result?.description
      );
   }

   async findAll(): Promise<Item[]> {
      const result = await ItemModel.find();
      return result.map((i) => {
         const item = new Item(
            new ItemId(i._id.toString()),
            i.name,
            new CategoryId(i.categoryId),
            new UserId(i.userId),
            i?.description
         );
         item.createdAt = i.createdAt;
         item.updatedAt = i.updatedAt;
         return item;
      });
   }

   async findItemsByIds(ids: string[], userId: string): Promise<Item[]> {
      const result = await ItemModel.find({ _id: { $in: ids }, userId });
      return result.map((i) => {
         const item = new Item(
            new ItemId(i._id.toString()),
            i.name,
            new CategoryId(i.categoryId),
            new UserId(i.userId),
            i?.description
         );
         item.createdAt = i.createdAt;
         item.updatedAt = i.updatedAt;
         return item;
      });
   }

   async findAllByUserId(userId: string): Promise<Item[]> {
      const result = await ItemModel.find({ userId });
      return result.map((i) => {
         const item = new Item(
            new ItemId(i._id.toString()),
            i.name,
            new CategoryId(i.categoryId),
            new UserId(i.userId),
            i?.description
         );
         item.createdAt = i.createdAt;
         item.updatedAt = i.updatedAt;
         return item;
      });
   }

   async findAllByUser(
      userId: string,
      filter: Filter<SearchItem>
   ): Promise<Pagination<Item>> {
      const queryFilter = {
         userId,
         ...(filter.search.name && {
            name: { $regex: filter.search.name, $options: 'i' },
         }),
      };
      const result = await ItemModel.find(queryFilter)
         .sort({ name: filter.order === 'asc' ? 1 : -1 })
         .skip(filter.skip)
         .limit(filter.limit);
      const items = result.map((i) => {
         const item = new Item(
            new ItemId(i._id.toString()),
            i.name,
            new CategoryId(i.categoryId),
            new UserId(i.userId),
            i?.description
         );
         item.createdAt = i.createdAt;
         item.updatedAt = i.updatedAt;
         return item;
      });
      const total = await ItemModel.countDocuments({ userId });
      const hasNext = total > filter.skip + filter.limit;
      return new Pagination(filter.page, filter.limit, total, hasNext, items);
   }

   async delete(id: string): Promise<void> {
      await ItemModel.findByIdAndDelete({ _id: id });
   }

   async deleteByUser(id: string, userId: string): Promise<void> {
      await ItemModel.findByIdAndDelete({ _id: id, userId });
   }
}
