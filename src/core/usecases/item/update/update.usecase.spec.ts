import UpdateItemUseCase from "./update.usecase";

const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn()
}

const input = {
    id: 'any_id',
    name: "Item 1",
    description: "any description",
    categoryId: "category_id_hash"
}
describe('Item update usecase test', () => { 
    it('should update an item', async () => { 
        const sut = new UpdateItemUseCase(mockRepository);
        mockRepository.find = jest.fn().mockReturnValue( { id: 'any_id', name: 'Item 2', description: 'other_description', categoryId: 'other_category_id_hash'})
        const item = await sut.execute(input);
        expect(item.name).toBe(input.name);
        expect(item.description).toBe(input.description);
        expect(item.categoryId).toBe(input.categoryId);
    })
    it('should throw an error if item does not exist', async () => { 
        const sut = new UpdateItemUseCase(mockRepository);
        mockRepository.find = jest.fn().mockReturnValue(undefined)
        await expect(sut.execute(input)).rejects.toThrow('Item not found')
    })


})