import { z } from 'zod';

export const deleteBillControllerSchema = z.object({
   id: z.string().min(1),
   userId: z.string().min(1),
});
