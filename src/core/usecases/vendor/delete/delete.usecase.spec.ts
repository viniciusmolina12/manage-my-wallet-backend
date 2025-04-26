import mockRepository from '../__mocks__/repository.mock';
import DeleteVendorUseCase from './delete.usecase';
import EntityError from '@core/domain/@shared/error/entity.error';
interface SutTypes {
   sut: DeleteVendorUseCase;
}

const makeSut = (): SutTypes => {
   const sut = new DeleteVendorUseCase(mockRepository as any);
   return { sut };
};

describe('DeleteVendorUseCase', () => {
   it('should call deleteByUser with correct values', async () => {
      const { sut } = makeSut();
      mockRepository.findByUser.mockResolvedValue({
         id: 'any_id',
         userId: 'any_user_id',
      });
      await sut.execute({
         id: 'any_id',
         userId: 'any_user_id',
      });
      expect(mockRepository.deleteByUser).toHaveBeenCalledWith(
         'any_id',
         'any_user_id'
      );
   });

   it('should throw an error if vendor is not found', async () => {
      const { sut } = makeSut();
      mockRepository.findByUser.mockResolvedValue(null);
      await expect(
         sut.execute({ id: 'any_id', userId: 'any_user_id' })
      ).rejects.toThrow(new EntityError('Vendor not found'));
   });
});
