import FindCategoryUseCase from './find.usecase';

const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
   findCategoryByName: jest.fn(),
};
describe('Find category usecase test', () => {
   it('should throw an error if category does not exist', async () => {
      const sut = new FindCategoryUseCase(mockRepository);
      mockRepository.find.mockReturnValueOnce(Promise.resolve(null));
      await expect(sut.execute('any_id')).rejects.toThrow('Category not found');
   });

   it('should return a category if category exists', async () => {
      const sut = new FindCategoryUseCase(mockRepository);
      mockRepository.find.mockReturnValueOnce(
         Promise.resolve({
            id: 'any_id',
            name: 'any_name',
            description: 'any_description',
         })
      );
      const category = await sut.execute('any_id');
      expect(category).toEqual({
         id: 'any_id',
         name: 'any_name',
         description: 'any_description',
      });
   });
});
