import { z } from 'zod';

export const findBillControllerSchema = z.object({
   id: z.string().min(1),
   userId: z.string().min(1),
});
