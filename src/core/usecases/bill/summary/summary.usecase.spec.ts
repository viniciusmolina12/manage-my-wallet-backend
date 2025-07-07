import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import SummaryBillUseCase from './summary.usecase';
import mockRepository from '../__mocks__/repository.bill.mock';
import { Filter } from '@core/domain/@shared/filter/filter';
import { PeriodFactory, PeriodType } from './periods';

describe('SummaryBillUseCase', () => {
   let sut: SummaryBillUseCase;
   let periodFactorySpy: jest.SpyInstance;
   let repositorySpy: jest.SpyInstance;

   beforeEach(() => {
      sut = new SummaryBillUseCase(mockRepository);
      periodFactorySpy = jest.spyOn(PeriodFactory, 'create');
      repositorySpy = jest.spyOn(mockRepository, 'findAllByUserAndPeriod');
      mockRepository.findAllByUserAndPeriod.mockResolvedValue([]);
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it('should be able to get the summary of the bills', async () => {
      const result = await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.MONTH,
      });
      expect(result).toEqual({
         bills: [],
      });
   });

   it('should call PeriodFactory.create with correct parameters for month period', async () => {
      const currentDate = new Date();
      const expectedYear = currentDate.getFullYear();
      const expectedMonth = currentDate.getMonth();

      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.MONTH,
      });

      expect(periodFactorySpy).toHaveBeenCalledWith(
         'month',
         expectedYear,
         expectedMonth
      );
   });

   it('should call PeriodFactory.create with correct parameters for year period', async () => {
      const currentDate = new Date();
      const expectedYear = currentDate.getFullYear();
      const expectedMonth = currentDate.getMonth();

      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.YEAR,
      });

      expect(periodFactorySpy).toHaveBeenCalledWith(
         'year',
         expectedYear,
         expectedMonth
      );
   });

   it('should call PeriodFactory.create with correct parameters for semester period', async () => {
      const currentDate = new Date();
      const expectedYear = currentDate.getFullYear();
      const expectedMonth = currentDate.getMonth();

      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.SEMESTER,
      });

      expect(periodFactorySpy).toHaveBeenCalledWith(
         'semester',
         expectedYear,
         expectedMonth
      );
   });

   it('should call PeriodFactory.create with correct parameters for quarter period', async () => {
      const currentDate = new Date();
      const expectedYear = currentDate.getFullYear();
      const expectedMonth = currentDate.getMonth();

      await sut.execute({
         userId: 'any_user_id',
         period: PeriodType.QUARTER,
      });

      expect(periodFactorySpy).toHaveBeenCalledWith(
         'quarter',
         expectedYear,
         expectedMonth
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
      const expectedYear = currentDate.getFullYear();
      const expectedMonth = currentDate.getMonth();

      // Dates que esperamos serem geradas para o período de mês
      const expectedStartDate = new Date(expectedYear, expectedMonth, 1);
      const expectedEndDate = new Date(expectedYear, expectedMonth + 1, 0);

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
      const expectedYear = currentDate.getFullYear();

      const expectedStartDate = new Date(expectedYear, 0, 1);
      const expectedEndDate = new Date(expectedYear, 11, 31);

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
      const expectedYear = currentDate.getFullYear();

      const expectedStartDate = new Date(expectedYear, 0, 1);
      const expectedEndDate = new Date(expectedYear, 5, 30);

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
      const expectedYear = currentDate.getFullYear();

      const expectedStartDate = new Date(expectedYear, 0, 1);
      const expectedEndDate = new Date(expectedYear, 3, 30);

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
