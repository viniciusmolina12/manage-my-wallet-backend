import {
   InputControllerDto,
   OutputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols/response';
import EntityError from '@core/domain/@shared/error/entity.error';
import { PeriodType } from '@core/usecases/bill/summary/periods';
import SummaryBillUseCase from '@core/usecases/bill/summary/summary.usecase';
import { Validator } from '@core/domain/interfaces/validator.interface';

interface InputSummaryBillControllerDto {
   userId: string;
   period: PeriodType;
}

interface OutputSummaryBillControllerDto {
   bills: {
      id: string;
      name: string;
      description?: string;
      total: number;
      vendorId: string;
      vendorName: string;
      date: string;
      createdAt: Date;
      updatedAt: Date;
      items: {
         quantity: number;
         price: number;
         categoryId: string;
         categoryName: string;
         itemId: string;
         description?: string;
      }[];
   }[];
}

export default class SummaryBillController {
   constructor(
      private readonly summaryBillUseCase: SummaryBillUseCase,
      private readonly validator: Validator
   ) {
      this.summaryBillUseCase = summaryBillUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputSummaryBillControllerDto>
   ): Promise<OutputControllerDto<OutputSummaryBillControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors.join(', '));
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
