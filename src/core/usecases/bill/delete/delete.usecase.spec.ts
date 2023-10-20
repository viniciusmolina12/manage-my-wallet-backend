import DeleteBillUseCase from "./delete.usecase";

const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn()
}
describe('Delete bill usecase test', () => {
    it('should delete a bill', async () => {
        const sut = new DeleteBillUseCase(mockRepository);
        mockRepository.find.mockReturnValue({ 
            description: 'any_description',
            name: 'any_name',
            items: [
                {
                    itemId: 'any_item_id',
                    price: 10,
                    quantity: 2
                }
            ]})
        mockRepository.delete = jest.fn().mockReturnValue(true);
        const result = await sut.execute('any_id');
        expect(result).toBeFalsy();
    })

    it('should throw an error if bill does not exist', async () => {
        const sut = new DeleteBillUseCase(mockRepository);
        mockRepository.find.mockReturnValue(undefined);
        await expect(sut.execute('any_id')).rejects.toThrow('Bill not found');
    })
})