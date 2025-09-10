import Category, {
   CategoryId,
} from '@core/domain/category/entity/category.entity';
import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import CategoryModel from '../../model/category.model';
import { UserId } from '@core/domain/user/entity/user.entity';

export default class MongoDbCategoryRepository implements CategoryRepository {
   async create(entity: Category): Promise<void> {
      await CategoryModel.create({
         _id: entity.id,
         name: entity.name,
         userId: entity.userId,
         description: entity.description,
      });
   }
   async update(entity: Category): Promise<void> {
      await CategoryModel.findOneAndUpdate(
         { _id: entity.id, userId: entity.userId },
         {
            name: entity.name,
            description: entity.description,
            updatedAt: new Date(),
         }
      );
   }

   async find(id: string): Promise<Category | null> {
      const result = await CategoryModel.findOne({ _id: id });
      if (!result) return null;
      const category = new Category(
         new CategoryId(result.id),
         result.name,
         new UserId(result.userId),
         result?.description
      );
      category.createdAt = result.createdAt;
      category.updatedAt = result.updatedAt;
      return category;
   }

   async findByUser(id: string, userId: string): Promise<Category | null> {
      const result = await CategoryModel.findOne({ _id: id, userId });
      if (!result) return null;
      const category = new Category(
         new CategoryId(result.id),
         result.name,
         new UserId(result.userId),
         result?.description
      );
      category.createdAt = result.createdAt;
      category.updatedAt = result.updatedAt;
      return category;
   }

   async findAll(): Promise<Category[]> {
      const result = await CategoryModel.find();
      return result.map((c) => {
         const category = new Category(
            new CategoryId(c.id),
            c.name,
            new UserId(c.userId),
            c?.description
         );
         category.createdAt = c.createdAt;
         category.updatedAt = c.updatedAt;
         return category;
      });
   }

   async findAllByUser(userId: string): Promise<Category[]> {
      const result = await CategoryModel.find({ userId });
      return result.map((c) => {
         const category = new Category(
            new CategoryId(c.id),
            c.name,
            new UserId(c.userId),
            c?.description
         );
         category.createdAt = c.createdAt;
         category.updatedAt = c.updatedAt;
         return category;
      });
   }

   async findCategoriesByIds(
      ids: string[],
      userId: string
   ): Promise<Category[]> {
      const result = await CategoryModel.find({ _id: { $in: ids }, userId });
      return result.map((c) => {
         const category = new Category(
            new CategoryId(c.id),
            c.name,
            new UserId(c.userId),
            c?.description
         );
         category.createdAt = c.createdAt;
         category.updatedAt = c.updatedAt;
         return category;
      });
   }

   async delete(id: string): Promise<void> {
      await CategoryModel.findByIdAndDelete({ _id: id });
   }

   async deleteByUser(id: string, userId: string): Promise<void> {
      await CategoryModel.findByIdAndDelete({ _id: id, userId });
   }

   async findCategoryByName(
      name: string,
      userId: string
   ): Promise<Category | undefined> {
      const result = await CategoryModel.findOne({ name: name, userId });
      if (!result) return undefined;
      const category = new Category(
         new CategoryId(result.id),
         result.name,
         new UserId(result.userId),
         result?.description
      );
      category.createdAt = result.createdAt;
      category.updatedAt = result.updatedAt;
      return category;
   }
}
