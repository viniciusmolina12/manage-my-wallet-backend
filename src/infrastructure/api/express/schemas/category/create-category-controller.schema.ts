import z from 'zod';

export const createCategoryControllerSchema = z.object({
   name: z.string().min(1),
   description: z.string().optional(),
   userId: z.string().min(1),
});
