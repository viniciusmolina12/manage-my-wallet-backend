import Item from '../../../../../core/domain/item/entity/item.entity';
import ItemModel from '../../model/item.model';
import mockDb from '../__mocks__/mockDb';
import MongoDbItemRepository from './item.repository';

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
   it('should create an item', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await sut.create(item);
      const itemCreated = await ItemModel.findOne({ _id: item.id });
      expect(itemCreated).toBeTruthy();
      expect(itemCreated?._id).toBe(item.id);
      expect(itemCreated?.name).toBe(item.name);
      expect(itemCreated?.description).toBe(item.description);
      expect(itemCreated?.categoryId).toBe(item.categoryId);
      expect(itemCreated?.userId).toBe(item.userId);
   });

   it('should update an item', async () => {
      const sut = new MongoDbItemRepository();
      const oldItem = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await ItemModel.create({
         _id: oldItem.id,
         name: oldItem.name,
         description: oldItem.description,
         categoryId: oldItem.categoryId,
         userId: oldItem.userId,
      });

      const itemCreated = await ItemModel.findOne({ _id: oldItem.id });
      expect(itemCreated).toBeTruthy();
      expect(itemCreated?._id).toBe(oldItem.id);
      expect(itemCreated?.name).toBe(oldItem.name);
      expect(itemCreated?.description).toBe(oldItem.description);
      expect(itemCreated?.categoryId).toBe(oldItem.categoryId);
      expect(itemCreated?.userId).toBe(oldItem.userId);
      const updateItem = new Item(
         'any_hash_id',
         'Item 2',
         'Category 2',
         'any_user_id',
         'Description 2'
      );
      await sut.update(updateItem);
      const itemUpdated = await ItemModel.findOne({ _id: oldItem.id });
      expect(itemUpdated?._id).toBe(updateItem.id);
      expect(itemUpdated?.name).toBe(updateItem.name);
      expect(itemUpdated?.description).toBe(updateItem.description);
      expect(itemUpdated?.categoryId).toBe(updateItem.categoryId);
   });

   it('should find an item', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId,
      });
      const itemFound = await sut.find(item.id);
      expect(itemFound?.id).toBe(item.id);
      expect(itemFound?.name).toBe(item.name);
      expect(itemFound?.description).toBe(item.description);
      expect(itemFound?.categoryId).toBe(item.categoryId);
      expect(itemFound?.userId).toBe(item.userId);
   });

   it('should find all items', async () => {
      const sut = new MongoDbItemRepository();
      const item1 = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await ItemModel.create({
         _id: item1.id,
         name: item1.name,
         description: item1.description,
         categoryId: item1.categoryId,
         userId: item1.userId,
      });
      const item2 = new Item(
         'any_hash_id_2',
         'Item 2',
         'Category 2',
         'any_user_id',
         'Description 2'
      );
      await ItemModel.create({
         _id: item2.id,
         name: item2.name,
         description: item2.description,
         categoryId: item2.categoryId,
         userId: item2.userId,
      });
      const itemsFound = await sut.findAll();
      expect(itemsFound).toHaveLength(2);
      expect(itemsFound[0].id).toBe(item1.id);
      expect(itemsFound[0].name).toBe(item1.name);
      expect(itemsFound[0].description).toBe(item1.description);
      expect(itemsFound[0].categoryId).toBe(item1.categoryId);
      expect(itemsFound[1].id).toBe(item2.id);
      expect(itemsFound[1].name).toBe(item2.name);
      expect(itemsFound[1].description).toBe(item2.description);
      expect(itemsFound[1].categoryId).toBe(item2.categoryId);
   });

   it('should find an item by name', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId,
      });
      const itemFound = await sut.findByName(item.name, item.userId);
      expect(itemFound?.id).toBe(item.id);
      expect(itemFound?.name).toBe(item.name);
      expect(itemFound?.description).toBe(item.description);
      expect(itemFound?.categoryId).toBe(item.categoryId);
      expect(itemFound?.userId).toBe(item.userId);
   });

   it('should not find an item by name', async () => {
      const sut = new MongoDbItemRepository();
      const itemFound = await sut.findByName(
         'non_existent_name',
         'any_user_id'
      );
      expect(itemFound).toBeNull();
   });

   it('should delete an item', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId,
      });
      await sut.delete(item.id);
      const itemFound = await ItemModel.findOne({ _id: item.id });
      expect(itemFound).toBeFalsy();
   });

   it('should delete an item by user', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId,
      });
      await sut.deleteByUser(item.id, item.userId);
      const itemFound = await ItemModel.findOne({ _id: item.id });
      expect(itemFound).toBeFalsy();
   });

   it('should find an item by user', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId,
      });
      const itemFound = await sut.findByUser(item.id, item.userId);
      expect(itemFound?.id).toBe(item.id);
      expect(itemFound?.name).toBe(item.name);
      expect(itemFound?.description).toBe(item.description);
      expect(itemFound?.categoryId).toBe(item.categoryId);
      expect(itemFound?.userId).toBe(item.userId);
   });

   it('should find all items by user', async () => {
      const sut = new MongoDbItemRepository();
      const item1 = new Item(
         'any_hash_id',
         'Item 1',
         'Category 1',
         'any_user_id',
         'Description 1'
      );
      await ItemModel.create({
         _id: item1.id,
         name: item1.name,
         description: item1.description,
         categoryId: item1.categoryId,
         userId: item1.userId,
      });
      const item2 = new Item(
         'any_hash_id_2',
         'Item 2',
         'Category 2',
         'any_user_id',
         'Description 2'
      );
      await ItemModel.create({
         _id: item2.id,
         name: item2.name,
         description: item2.description,
         categoryId: item2.categoryId,
         userId: item2.userId,
      });
      const itemsFound = await sut.findAllByUserId(item1.userId);
      expect(itemsFound).toHaveLength(2);
      expect(itemsFound[0].id).toBe(item1.id);
      expect(itemsFound[0].name).toBe(item1.name);
      expect(itemsFound[0].description).toBe(item1.description);
      expect(itemsFound[0].categoryId).toBe(item1.categoryId);
      expect(itemsFound[1].id).toBe(item2.id);
      expect(itemsFound[1].name).toBe(item2.name);
      expect(itemsFound[1].description).toBe(item2.description);
      expect(itemsFound[1].categoryId).toBe(item2.categoryId);
   });
});
