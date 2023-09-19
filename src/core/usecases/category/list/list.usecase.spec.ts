import ListCategoryUseCase from "./list.usecase";

const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    findCategoryByName: jest.fn()
}
describe('List category usecase test', () => {
    it('should list all categories', async () => {
        const sut = new ListCategoryUseCase(mockRepository);
        mockRepository.findAll.mockReturnValueOnce(Promise.resolve([
            {
                id: 'category_id_1',
                name: 'category_1',
                description: 'category_description_1',
            },
            {
                id: 'category_id_2',
                name: 'category_2',
                description: 'category_description_2',
            }
        ]))
        const { categories } = await sut.execute();
        expect(categories).toBeTruthy();
        expect(categories.length).toBe(2);
        expect(categories[0].id).toBe('category_id_1');
        expect(categories[0].name).toBe('category_1');
        expect(categories[0].description).toBe('category_description_1');
        expect(categories[1].id).toBe('category_id_2');
        expect(categories[1].name).toBe('category_2');
        expect(categories[1].description).toBe('category_description_2');
    })
})