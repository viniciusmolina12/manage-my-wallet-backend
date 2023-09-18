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
})