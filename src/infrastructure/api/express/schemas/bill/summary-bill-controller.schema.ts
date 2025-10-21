import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';
import { PeriodType } from '@core/usecases/bill/summary/periods';

export const summaryBillControllerSchema = z.object({
   userId: z
      .string({ message: ERROR_MESSAGES.USER_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.USER_ID_INVALID }),
   period: z
      .string({ message: ERROR_MESSAGES.PERIOD_REQUIRED })
      .refine((val) => Object.values(PeriodType).includes(val as PeriodType), {
         message: ERROR_MESSAGES.PERIOD_INVALID,
      }),
});
