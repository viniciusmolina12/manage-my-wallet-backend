import { z } from 'zod';

export const summaryBillControllerSchema = z.object({
   userId: z.string().min(1),
   period: z.string().min(1),
});
