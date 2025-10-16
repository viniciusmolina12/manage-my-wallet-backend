import z from 'zod';

export const updateCategoryControllerSchema = z.object({
   id: z.string().min(1),
   name: z.string().min(1),
   description: z.string().optional(),
   userId: z.string().min(1),
});
