import { z } from 'zod';

export const findItemControllerSchema = z.object({
   id: z.string().min(1),
   userId: z.string().min(1),
});
