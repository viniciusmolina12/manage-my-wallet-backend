import {
   BillRepository,
   SearchBill,
} from '@core/domain/bill/repository/bill.repository';
import { InputSummaryBillDto, OutputSummaryBillDto } from './summary.bill.dto';
import { PeriodFactory } from './periods';
import { SummaryBillUseCaseMapper } from './summary.usecase.mapper';

export default class SummaryBillUseCase {
   private readonly billRepository: BillRepository;
   constructor(billRepository: BillRepository) {
      this.billRepository = billRepository;
   }

   async execute(input: InputSummaryBillDto): Promise<OutputSummaryBillDto> {
      const { userId, period } = input;
      const today = new Date();
      const interval = PeriodFactory.create(period, today);

      const result = await this.billRepository.findAllByUserAndPeriod(
         userId,
         interval.startDate,
         interval.endDate
      );
      return SummaryBillUseCaseMapper.toOutput(result);
   }
}
