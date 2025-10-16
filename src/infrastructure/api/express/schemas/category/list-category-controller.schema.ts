import z from 'zod';

export const listCategoryControllerSchema = z.object({
   userId: z.string().min(1),
});
