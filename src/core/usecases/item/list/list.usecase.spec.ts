import ListItemUsecase from "./list.usecase";

const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn()
}

const mockItemList = [

    { 
      id: 'any_id',
      name: 'Item 2',
      description: 'other_description', 
      categoryId: 'other_category_id_hash'
    },
    { 
        id: 'other_id',
        name: 'Item 1',
        description: 'other_description', 
        categoryId: 'other_category_id_hash'
    }
]
describe('Item List usecase test', () => {
    it('should list items', async () => {
        const sut = new ListItemUsecase(mockRepository);
        mockRepository.findAll.mockReturnValue(mockItemList)
        const output = await sut.execute();
        expect(output.items).toHaveLength(2);
        expect(output.items[0].id).toBe('any_id');
        expect(output.items[0].name).toBe('Item 2');
        expect(output.items[0].description).toBe('other_description');
        expect(output.items[0].categoryId).toBe('other_category_id_hash');
        expect(output.items[1].id).toBe('other_id');
        expect(output.items[1].name).toBe('Item 1');
        expect(output.items[1].description).toBe('other_description');
        expect(output.items[1].categoryId).toBe('other_category_id_hash');
    })
})