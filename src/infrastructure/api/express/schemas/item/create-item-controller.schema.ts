import { z } from 'zod';

export const createItemControllerSchema = z.object({
   name: z.string().min(1),
   description: z.string().optional(),
   categoryId: z.string().min(1),
   userId: z.string().min(1),
});
