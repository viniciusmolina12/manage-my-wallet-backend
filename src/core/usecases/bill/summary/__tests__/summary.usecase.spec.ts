import SummaryBillUseCase from '../summary.usecase';
import mockRepository from '../../__mocks__/repository.bill.mock';
import mockVendorRepository from '../../../vendor/__mocks__/repository.vendor.mock';
import mockItemRepository from '../../../item/__mocks__/repository.item.mock';
import mockCategoryRepository from '../../../category/__mocks__/repository.category.mock';
import { PeriodFactory, PeriodType } from '../periods';

describe('SummaryBillUseCase', () => {
   let sut: SummaryBillUseCase;
   let periodFactorySpy: jest.SpyInstance;
   let repositorySpy: jest.SpyInstance;

   beforeEach(() => {
      sut = new SummaryBillUseCase(
         mockRepository,
         mockVendorRepository,
         mockItemRepository,
         mockCategoryRepository
      );
      periodFactorySpy = jest.spyOn(PeriodFactory, 'create');
      repositorySpy = jest.spyOn(mockRepository, 'findAllByUserAndPeriod');
      mockRepository.findAllByUserAndPeriod.mockResolvedValue([]);
      mockVendorRepository.findVendorsByIds.mockResolvedValue([]);
      mockItemRepository.findItemsByIds.mockResolvedValue([]);
      mockCategoryRepository.findCategoriesByIds.mockResolvedValue([]);
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it('should call PeriodFactory.create with correct parameters for month period', async () => {
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.MONTH,
      });

      expect(periodFactorySpy).toHaveBeenCalledWith('month', expect.any(Date));
   });

   it('should call PeriodFactory.create with correct parameters for year period', async () => {
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.YEAR,
      });

      expect(periodFactorySpy).toHaveBeenCalledWith('year', expect.any(Date));
   });

   it('should call PeriodFactory.create with correct parameters for semester period', async () => {
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.SEMESTER,
      });

      expect(periodFactorySpy).toHaveBeenCalledWith(
         'semester',
         expect.any(Date)
      );
   });

   it('should call PeriodFactory.create with correct parameters for quarter period', async () => {
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.QUARTER,
      });

      expect(periodFactorySpy).toHaveBeenCalledWith(
         'quarter',
         expect.any(Date)
      );
   });

   it('should call PeriodFactory.create only once', async () => {
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.MONTH,
      });

      expect(periodFactorySpy).toHaveBeenCalledTimes(1);
   });

   it('should call findAllByUserAndPeriod with correct dates for month period', async () => {
      const currentDate = new Date();
      const expectedStartDate = new Date(
         currentDate.getFullYear(),
         currentDate.getMonth(),
         1
      );
      const expectedEndDate = new Date(
         currentDate.getFullYear(),
         currentDate.getMonth() + 1,
         0
      );

      repositorySpy.mockClear();
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.MONTH,
      });

      expect(repositorySpy).toHaveBeenCalledWith(
         'any_user_id',
         expectedStartDate,
         expectedEndDate
      );
   });

   it('should call findAllByUserAndPeriod with correct dates for year period', async () => {
      const currentDate = new Date();
      const expectedStartDate = new Date(currentDate.getFullYear(), 0, 1);
      const expectedEndDate = new Date(currentDate.getFullYear(), 11, 31);
      repositorySpy.mockClear();
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.YEAR,
      });

      expect(repositorySpy).toHaveBeenCalledWith(
         'any_user_id',
         expectedStartDate,
         expectedEndDate
      );
   });

   it('should call findAllByUserAndPeriod with correct dates for semester period', async () => {
      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
      const expectedStartDate = new Date(sixMonthsAgo);
      const expectedEndDate = currentDate;

      repositorySpy.mockClear();
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.SEMESTER,
      });

      expect(repositorySpy).toHaveBeenCalledWith(
         'any_user_id',
         expectedStartDate,
         expectedEndDate
      );
   });

   it('should call findAllByUserAndPeriod with correct dates for quarter period', async () => {
      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      const expectedStartDate = new Date(threeMonthsAgo);
      const expectedEndDate = currentDate;

      repositorySpy.mockClear();
      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.QUARTER,
      });

      expect(repositorySpy).toHaveBeenCalledWith(
         'any_user_id',
         expectedStartDate,
         expectedEndDate
      );
   });
});
