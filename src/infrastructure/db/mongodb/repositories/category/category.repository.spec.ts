import Category, {
   CategoryId,
} from '@core/domain/category/entity/category.entity';
import mockDb from '../__mocks__/mockDb';
import CategoryModel from '../../model/category.model';
import MongoDbCategoryRepository from './category.repository';

beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   await mockDb.clear();
});

afterAll(async () => {
   await mockDb.disconnect();
});
describe('MongoDB Item Repository tests', () => {
   it('should create a category', async () => {
      const sut = new MongoDbCategoryRepository();
      const category = new Category(
         new CategoryId('123e4567-e89b-12d3-a456-426614174000'),
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await sut.create(category);
      const categoryCreated = await CategoryModel.findOne({
         _id: category.id,
      });
      expect(categoryCreated).toBeTruthy();
      expect(categoryCreated?._id).toBe(category.id.toString());
      expect(categoryCreated?.name).toBe(category.name);
      expect(categoryCreated?.description).toBe(category.description);
   });
   it('should update a category', async () => {
      const sut = new MongoDbCategoryRepository();
      const oldCategory = new Category(
         new CategoryId('123e4567-e89b-12d3-a456-426614174000'),
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await CategoryModel.create({
         _id: oldCategory.id.toString(),
         name: oldCategory.name,
         description: oldCategory.description,
         userId: oldCategory.userId,
      });

      const categoryCreated = await CategoryModel.findOne({
         _id: oldCategory.id.toString(),
      });
      expect(categoryCreated).toBeTruthy();
      expect(categoryCreated?._id).toBe(oldCategory.id.toString());
      expect(categoryCreated?.name).toBe(oldCategory.name);
      expect(categoryCreated?.description).toBe(oldCategory.description);

      const updateCategory = new Category(
         new CategoryId('123e4567-e89b-12d3-a456-426614174000'),
         'Category 2',
         'any_user_id',
         'Description 2'
      );
      await sut.update(updateCategory);
      const categoryUpdated = await CategoryModel.findOne({
         _id: oldCategory.id.toString(),
      });
      expect(categoryUpdated?._id).toBe(updateCategory.id.toString());
      expect(categoryUpdated?.name).toBe(updateCategory.name);
      expect(categoryUpdated?.description).toBe(updateCategory.description);
   });

   it('should find a category', async () => {
      const sut = new MongoDbCategoryRepository();
      const category = new Category(
         new CategoryId('123e4567-e89b-12d3-a456-426614174000'),
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await CategoryModel.create({
         _id: category.id.toString(),
         name: category.name,
         description: category.description,
         userId: category.userId,
      });
      const categoryFound = await sut.find(category.id.toString());
      expect(categoryFound?.id).toEqual(category.id);
      expect(categoryFound?.name).toBe(category.name);
      expect(categoryFound?.description).toBe(category.description);
   });

   it('should find all categories', async () => {
      const sut = new MongoDbCategoryRepository();
      const category1 = new Category(
         new CategoryId('123e4567-e89b-12d3-a456-426614174000'),
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await CategoryModel.create({
         _id: category1.id.toString(),
         name: category1.name,
         description: category1.description,
         userId: category1.userId,
      });
      const category2 = new Category(
         new CategoryId('123e4567-e89b-12d3-a456-426614174001'),
         'Category 2',
         'any_user_id',
         'Description 2'
      );
      await CategoryModel.create({
         _id: category2.id.toString(),
         name: category2.name,
         description: category2.description,
         userId: category2.userId,
      });
      const categoriesFound = await sut.findAll();
      expect(categoriesFound).toHaveLength(2);
      expect(categoriesFound[0].id).toEqual(category1.id);
      expect(categoriesFound[0].name).toBe(category1.name);
      expect(categoriesFound[0].description).toBe(category1.description);
      expect(categoriesFound[1].id).toEqual(category2.id);
      expect(categoriesFound[1].name).toBe(category2.name);
      expect(categoriesFound[1].description).toBe(category2.description);
   });

   it('should delete a category', async () => {
      const sut = new MongoDbCategoryRepository();
      const category = new Category(
         new CategoryId('123e4567-e89b-12d3-a456-426614174000'),
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await CategoryModel.create({
         _id: category.id.toString(),
         name: category.name,
         description: category.description,
         userId: category.userId,
      });
      await sut.delete(category.id.toString());
      const itemFound = await CategoryModel.findOne({
         _id: category.id.toString(),
      });
      expect(itemFound).toBeFalsy();
   });

   it('should find a category by name', async () => {
      const sut = new MongoDbCategoryRepository();
      const category = new Category(
         new CategoryId('123e4567-e89b-12d3-a456-426614174000'),
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await CategoryModel.create({
         _id: category.id.toString(),
         name: category.name,
         description: category.description,
         userId: category.userId,
      });
      const categoryFound = await sut.findCategoryByName(
         category.name,
         category.userId
      );
      expect(categoryFound?.id).toEqual(category.id);
      expect(categoryFound?.name).toBe(category.name);
      expect(categoryFound?.description).toBe(category.description);
   });

   it('should return undefined if category name does not exist', async () => {
      const sut = new MongoDbCategoryRepository();
      const categoryFound = await sut.findCategoryByName(
         'any_name',
         'any_user_id'
      );
      expect(categoryFound).toBeUndefined();
   });
});
