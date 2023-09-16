import DeleteItemUseCase from "./delete.usecase";

const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn()
}

describe('Item delete usecase', () => {

    it('should delete an item', async () => {
        const sut = new DeleteItemUseCase(mockRepository);
        mockRepository.find.mockReturnValue({ id: 'any_id', name: 'Item 1', description: 'any description', categoryId: 'category_id_hash'})
        mockRepository.delete = jest.fn().mockReturnValue(true);
        const result = await sut.execute('any_id');
        expect(result).toBeFalsy();
    })

    it('should throw an error if item does not exist', async () => {
        const sut = new DeleteItemUseCase(mockRepository);
        mockRepository.find.mockReturnValue(undefined);
        await expect(sut.execute('any_id')).rejects.toThrow('Item not found');
    })
} )