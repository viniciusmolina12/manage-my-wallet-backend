import Item, {
   ItemId,
} from '../../../../../core/domain/item/entity/item.entity';
import ItemModel from '../../model/item.model';
import BillModel from '../../model/bill.model';
import mockDb from '../__mocks__/mockDb';
import MongoDbItemRepository from './item.repository';
import { CategoryId } from '@core/domain/category/entity/category.entity';
import { UserId } from '@core/domain/user/entity/user.entity';

beforeAll(async () => {
   await mockDb.connect();
   //valid uuid - 123e4567-e89b-12d3-a456-426614174000
   //create a bill just to register the schema for Item pre hook
   await BillModel.create({
      _id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'any_bill_name',
      date: new Date(),
      userId: '123e4567-e89b-12d3-a456-426614174000',
      vendorId: '123e4567-e89b-12d3-a456-426614174000',
      items: [
         {
            itemId: '123e4567-e89b-12d3-a456-426614174000',
            price: 10,
            quantity: 2,
         },
      ],
      total: 20,
   });
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
      const id = new ItemId();
      const item = new Item(
         id,
         'Item 1',
         new CategoryId(),
         new UserId(),
         'Description 1'
      );
      await sut.create(item);
      const itemCreated = await ItemModel.findOne({ _id: item.id });
      expect(itemCreated).toBeTruthy();
      expect(itemCreated?._id).toBe(item.id);
      expect(itemCreated?.name).toBe(item.name);
      expect(itemCreated?.description).toBe(item.description);
      expect(itemCreated?.categoryId).toBe(item.categoryId);
      expect(itemCreated?.userId).toBe(item.userId.id);
   });

   it('should update an item', async () => {
      const sut = new MongoDbItemRepository();
      const oldItem = new Item(
         new ItemId(),
         'Item 1',
         new CategoryId(),
         new UserId(),
         'Description 1'
      );
      await ItemModel.create({
         _id: oldItem.id,
         name: oldItem.name,
         description: oldItem.description,
         categoryId: oldItem.categoryId,
         userId: oldItem.userId.id,
      });

      const itemCreated = await ItemModel.findOne({ _id: oldItem.id });
      expect(itemCreated).toBeTruthy();
      expect(itemCreated?._id).toBe(oldItem.id);
      expect(itemCreated?.name).toBe(oldItem.name);
      expect(itemCreated?.description).toBe(oldItem.description);
      expect(itemCreated?.categoryId).toBe(oldItem.categoryId);
      expect(itemCreated?.userId).toBe(oldItem.userId.id);
      const updateItem = new Item(
         new ItemId(oldItem.id),
         'Item 2',
         new CategoryId(),
         new UserId(),
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
         new ItemId(),
         'Item 1',
         new CategoryId(),
         new UserId(),
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId.id,
      });
      const itemFound = await sut.find(item.id);
      expect(itemFound?.id).toBe(item.id);
      expect(itemFound?.name).toBe(item.name);
      expect(itemFound?.description).toBe(item.description);
      expect(itemFound?.categoryId).toBe(item.categoryId);
      expect(itemFound?.userId).toEqual(item.userId);
   });

   it('should find all items', async () => {
      const sut = new MongoDbItemRepository();
      const item1 = new Item(
         new ItemId(),
         'Item 1',
         new CategoryId(),
         new UserId(),
         'Description 1'
      );
      await ItemModel.create({
         _id: item1.id,
         name: item1.name,
         description: item1.description,
         categoryId: item1.categoryId,
         userId: item1.userId.id,
      });
      const item2 = new Item(
         new ItemId(),
         'Item 2',
         new CategoryId(),
         new UserId(),
         'Description 2'
      );
      await ItemModel.create({
         _id: item2.id,
         name: item2.name,
         description: item2.description,
         categoryId: item2.categoryId,
         userId: item2.userId.id,
      });
      const itemsFound = await sut.findAll();
      expect(itemsFound).toHaveLength(2);
      expect(itemsFound[0].id).toBe(item1.id);
      expect(itemsFound[0].name).toBe(item1.name);
      expect(itemsFound[0].description).toBe(item1.description);
      expect(itemsFound[0].categoryId).toBe(item1.categoryId);
      expect(itemsFound[0].createdAt).toBeDefined();
      expect(itemsFound[0].updatedAt).toBeDefined();
      expect(itemsFound[1].id).toBe(item2.id);
      expect(itemsFound[1].name).toBe(item2.name);
      expect(itemsFound[1].description).toBe(item2.description);
      expect(itemsFound[1].categoryId).toBe(item2.categoryId);
      expect(itemsFound[1].createdAt).toBeDefined();
      expect(itemsFound[1].updatedAt).toBeDefined();
   });

   it('should find an item by name', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         new ItemId(),
         'Item 1',
         new CategoryId(),
         new UserId(),
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId.id,
      });
      const itemFound = await sut.findByName(item.name, item.userId.id);
      expect(itemFound?.id).toBe(item.id);
      expect(itemFound?.name).toBe(item.name);
      expect(itemFound?.description).toBe(item.description);
      expect(itemFound?.categoryId).toBe(item.categoryId);
      expect(itemFound?.userId).toEqual(item.userId);
      expect(itemFound?.createdAt).toBeDefined();
      expect(itemFound?.updatedAt).toBeDefined();
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
         new ItemId(),
         'Item 1',
         new CategoryId(),
         new UserId(),
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId.id,
      });
      await sut.delete(item.id);
      const itemFound = await ItemModel.findOne({ _id: item.id });
      expect(itemFound).toBeFalsy();
   });

   it('should delete an item by user', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         new ItemId(),
         'Item 1',
         new CategoryId(),
         new UserId(),
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId.id,
      });
      await sut.deleteByUser(item.id, item.userId.id);
      const itemFound = await ItemModel.findOne({ _id: item.id });
      expect(itemFound).toBeFalsy();
   });

   it('should find an item by user', async () => {
      const sut = new MongoDbItemRepository();
      const item = new Item(
         new ItemId(),
         'Item 1',
         new CategoryId(),
         new UserId(),
         'Description 1'
      );
      await ItemModel.create({
         _id: item.id,
         name: item.name,
         description: item.description,
         categoryId: item.categoryId,
         userId: item.userId,
      });
      const itemFound = await sut.findByUser(item.id, item.userId.id);
      expect(itemFound?.id).toBe(item.id);
      expect(itemFound?.name).toBe(item.name);
      expect(itemFound?.description).toBe(item.description);
      expect(itemFound?.categoryId).toBe(item.categoryId);
      expect(itemFound?.userId).toEqual(item.userId);
      expect(itemFound?.createdAt).toBeDefined();
      expect(itemFound?.updatedAt).toBeDefined();
   });

   it('should find all items by user', async () => {
      const sut = new MongoDbItemRepository();
      const userId = new UserId();
      const item1 = new Item(
         new ItemId(),
         'Item 1',
         new CategoryId(),
         userId,
         'Description 1'
      );
      await ItemModel.create({
         _id: item1.id,
         name: item1.name,
         description: item1.description,
         categoryId: item1.categoryId,
         userId: userId.id,
      });
      const item2 = new Item(
         new ItemId(),
         'Item 2',
         new CategoryId(),
         userId,
         'Description 2'
      );
      await ItemModel.create({
         _id: item2.id,
         name: item2.name,
         description: item2.description,
         categoryId: item2.categoryId,
         userId: userId.id,
      });
      const itemsFound = await sut.findAllByUserId(userId.id);
      expect(itemsFound).toHaveLength(2);
      expect(itemsFound[0].id).toBe(item1.id);
      expect(itemsFound[0].name).toBe(item1.name);
      expect(itemsFound[0].description).toBe(item1.description);
      expect(itemsFound[0].categoryId).toBe(item1.categoryId);
      expect(itemsFound[1].id).toBe(item2.id);
      expect(itemsFound[1].name).toBe(item2.name);
      expect(itemsFound[1].description).toBe(item2.description);
      expect(itemsFound[1].categoryId).toBe(item2.categoryId);
      expect(itemsFound[0].createdAt).toBeDefined();
      expect(itemsFound[0].updatedAt).toBeDefined();
      expect(itemsFound[1].createdAt).toBeDefined();
      expect(itemsFound[1].updatedAt).toBeDefined();
   });
});
