import {
   InputControllerDto,
   OutputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols/response';
import EntityError from '@core/domain/@shared/error/entity.error';
import { PeriodType } from '@core/usecases/bill/summary/periods';
import SummaryBillUseCase from '@core/usecases/bill/summary/summary.usecase';

interface InputSummaryBillControllerDto {
   userId: string;
   period: PeriodType;
}

interface OutputSummaryBillControllerDto {
   bills: {
      id: string;
      description?: string;
      name: string;
      vendorId: string;
      total: number;
      createdAt: Date;
      updatedAt: Date;
      date: Date;
      items: {
         id: string;
         itemId: string;
         price: number;
         quantity: number;
      }[];
   }[];
}

export default class SummaryBillController {
   constructor(private readonly summaryBillUseCase: SummaryBillUseCase) {
      this.summaryBillUseCase = summaryBillUseCase;
   }
   public async handle(
      input: InputControllerDto<InputSummaryBillControllerDto>
   ): Promise<OutputControllerDto<OutputSummaryBillControllerDto>> {
      try {
         const summary = await this.summaryBillUseCase.execute(input.data);
         return response<OutputSummaryBillControllerDto>(
            200,
            'Summary of bills',
            summary
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
