import Category from '@core/domain/category/entity/category.entity';
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
         'any_hash_id',
         'Category 1',
         'Description 1'
      );
      await sut.create(category);
      const categoryCreated = await CategoryModel.findOne({
         _id: category.id,
      });
      expect(categoryCreated).toBeTruthy();
      expect(categoryCreated?._id).toBe(category.id);
      expect(categoryCreated?.name).toBe(category.name);
      expect(categoryCreated?.description).toBe(category.description);
   });
   it('should update a category', async () => {
      const sut = new MongoDbCategoryRepository();
      const oldCategory = new Category(
         'any_hash_id',
         'Category 1',
         'Description 1'
      );
      await CategoryModel.create({
         _id: oldCategory.id,
         name: oldCategory.name,
         description: oldCategory.description,
      });

      const categoryCreated = await CategoryModel.findOne({
         _id: oldCategory.id,
      });
      expect(categoryCreated).toBeTruthy();
      expect(categoryCreated?._id).toBe(oldCategory.id);
      expect(categoryCreated?.name).toBe(oldCategory.name);
      expect(categoryCreated?.description).toBe(oldCategory.description);

      const updateCategory = new Category(
         'any_hash_id',
         'Category 2',
         'Description 2'
      );
      await sut.update(updateCategory);
      const categoryUpdated = await CategoryModel.findOne({
         _id: oldCategory.id,
      });
      expect(categoryUpdated?._id).toBe(updateCategory.id);
      expect(categoryUpdated?.name).toBe(updateCategory.name);
      expect(categoryUpdated?.description).toBe(updateCategory.description);
   });

   it('should find a category', async () => {
      const sut = new MongoDbCategoryRepository();
      const category = new Category(
         'any_hash_id',
         'Category 1',
         'Description 1'
      );
      await CategoryModel.create({
         _id: category.id,
         name: category.name,
         description: category.description,
      });
      const categoryFound = await sut.find(category.id);
      expect(categoryFound?.id).toBe(category.id);
      expect(categoryFound?.name).toBe(category.name);
      expect(categoryFound?.description).toBe(category.description);
   });

   it('should find all categories', async () => {
      const sut = new MongoDbCategoryRepository();
      const category1 = new Category(
         'any_hash_id',
         'Category 1',
         'Description 1'
      );
      await CategoryModel.create({
         _id: category1.id,
         name: category1.name,
         description: category1.description,
      });
      const category2 = new Category(
         'any_hash_id_2',
         'Category 2',
         'Description 2'
      );
      await CategoryModel.create({
         _id: category2.id,
         name: category2.name,
         description: category2.description,
      });
      const categoriesFound = await sut.findAll();
      expect(categoriesFound).toHaveLength(2);
      expect(categoriesFound[0].id).toBe(category1.id);
      expect(categoriesFound[0].name).toBe(category1.name);
      expect(categoriesFound[0].description).toBe(category1.description);
      expect(categoriesFound[1].id).toBe(category2.id);
      expect(categoriesFound[1].name).toBe(category2.name);
      expect(categoriesFound[1].description).toBe(category2.description);
   });

   it('should delete a category', async () => {
      const sut = new MongoDbCategoryRepository();
      const category = new Category(
         'any_hash_id',
         'Category 1',
         'Description 1'
      );
      await CategoryModel.create({
         _id: category.id,
         name: category.name,
         description: category.description,
      });
      await sut.delete(category.id);
      const itemFound = await CategoryModel.findOne({ _id: category.id });
      expect(itemFound).toBeFalsy();
   });

   it('should find a category by name', async () => {
      const sut = new MongoDbCategoryRepository();
      const category = new Category(
         'any_hash_id',
         'Category 1',
         'Description 1'
      );
      await CategoryModel.create({
         _id: category.id,
         name: category.name,
         description: category.description,
      });
      const categoryFound = await sut.findCategoryByName(category.name);
      expect(categoryFound?.id).toBe(category.id);
      expect(categoryFound?.name).toBe(category.name);
      expect(categoryFound?.description).toBe(category.description);
   });

   it('should return undefined if category name does not exist', async () => {
      const sut = new MongoDbCategoryRepository();
      const categoryFound = await sut.findCategoryByName('any_name');
      expect(categoryFound).toBeUndefined();
   });
});
