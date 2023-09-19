import DeleteCategoryUseCase from "./delete.usecase";

const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    findCategoryByName: jest.fn()
}
describe('Delete category usecase test', () => {
    it('should delete a category', async () => {
        const sut = new DeleteCategoryUseCase(mockRepository);
        mockRepository.find.mockReturnValue({ id: 'any_id', name: 'Category 1', description: 'any description'})
        mockRepository.delete = jest.fn().mockReturnValue(true);
        const result = await sut.execute('any_id');
        expect(result).toBeFalsy();
    })

    it('should throw an error if item does not exist', async () => {
        const sut = new DeleteCategoryUseCase(mockRepository);
        mockRepository.find.mockReturnValue(undefined);
        await expect(sut.execute('any_id')).rejects.toThrow('Category not found');
    })
})