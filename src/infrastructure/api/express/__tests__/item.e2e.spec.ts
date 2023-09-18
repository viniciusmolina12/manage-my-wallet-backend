import request from 'supertest';
import { app } from '../app';
import mockDb from '../../../db/mongodb/repositories/__mocks__/mockDb';
import ItemModel from '../../../db/mongodb/model/item.model';

beforeAll(async () => {
    await mockDb.connect();
} )

beforeEach(async () => { 
    await mockDb.clear();
})

afterAll(async () => {
    await mockDb.disconnect();
} )
describe('Item e2e tests', () => {
    it('should create an item', async () => {
        const response = await request(app)
            .post('/api/item')
            .send({
                name: 'any_item_name',
                description: 'any_item_description',
                categoryId: 'any_category_id'
            })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message', 'Item created successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name', 'any_item_name');
        expect(response.body.data).toHaveProperty('description', 'any_item_description');
        expect(response.body.data).toHaveProperty('categoryId', 'any_category_id'); 
    })
    

    it('should return an error when creating an item with invalid data', async () => {
        const response = await request(app)
            .post('/api/item')
            .send({})
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Item: Name is required, Item: Category is required, ');
    })

    it('should update an item', async () => {
        const item = await ItemModel.create({ _id: 'any_hash_id', name: 'Item 1', description: 'Description 1', categoryId: 'Category 1' });
        const response = await request(app)
            .put(`/api/item/${item._id}`)
            .send({
                name: 'any_item_name',
                description: 'any_item_description',
                categoryId: 'any_category_id'
            })
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message', 'Item updated succesfully');
        expect(response.body.data).toHaveProperty('name', 'any_item_name');
        expect(response.body.data).toHaveProperty('description', 'any_item_description');
        expect(response.body.data).toHaveProperty('categoryId', 'any_category_id'); 
    })

    it('should return an error when try update a non-existent item', async () => {
        const response = await request(app)
            .put('/api/item/any_hash_id')
            .send({})
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Item not found');
        expect(response.body).not.toHaveProperty('data');
    })

    it('should return an error when updating an item with invalid data', async () => {
        const item = await ItemModel.create({ _id: 'any_hash_id', name: 'Item 1', description: 'Description 1', categoryId: 'Category 1' });
        const response = await request(app)
            .put(`/api/item/${item.id}`)
            .send({})
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Item: Name is required, Item: Category is required, ');
        expect(response.body).not.toHaveProperty('data');
    })

    it('should get an item', async () => {
        const item = await ItemModel.create({ _id: 'any_hash_id', name: 'Item 1', description: 'Description 1', categoryId: 'Category 1' });
        const response = await request(app)
            .get(`/api/item/${item._id}`)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message', 'Item founded succesfully');
        expect(response.body.data).toHaveProperty('id', item._id);
        expect(response.body.data).toHaveProperty('name', 'Item 1');
        expect(response.body.data).toHaveProperty('description', 'Description 1');
        expect(response.body.data).toHaveProperty('categoryId', 'Category 1'); 
    })

    it('should get all items', async () => {
        const item1 = await ItemModel.create({ _id: 'any_hash_id', name: 'Item 1', description: 'Description 1', categoryId: 'Category 1' });
        const item2 = await ItemModel.create({ _id: 'any_hash_id_2', name: 'Item 2', description: 'Description 2', categoryId: 'Category 2' });
        const response = await request(app)
            .get('/api/items')
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message', 'Items listed succesfully');
        expect(response.body.data.items).toHaveLength(2);
        expect(response.body.data.items[0]).toHaveProperty('id', item1._id);
        expect(response.body.data.items[0]).toHaveProperty('name', item1.name);
        expect(response.body.data.items[0]).toHaveProperty('description', item1.description);
        expect(response.body.data.items[0]).toHaveProperty('categoryId', item1.categoryId); 
        expect(response.body.data.items[1]).toHaveProperty('id', item2._id);
        expect(response.body.data.items[1]).toHaveProperty('name', item2.name);
        expect(response.body.data.items[1]).toHaveProperty('description', item2.description);
        expect(response.body.data.items[1]).toHaveProperty('categoryId', item2.categoryId);
    })

    it('should delete an item', async () => {
        const item = await ItemModel.create({ _id: 'any_hash_id', name: 'Item 1', description: 'Description 1', categoryId: 'Category 1' });
        const response = await request(app)
            .delete(`/api/item/${item._id}`)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Item deleted succesfully');
        expect(response.body).not.toHaveProperty('data');
        const itemFound = await ItemModel.findOne({_id: item._id});
        expect(itemFound).toBeFalsy();
    })


    it('should return an error when try delete a non-existent item', async () => {
        const response = await request(app)
            .delete(`/api/item/non-existent-id`)
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Item not found');
        expect(response.body).not.toHaveProperty('data');
    })


    
})
    
    
