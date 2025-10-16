import { z } from 'zod';

export const listItemControllerSchema = z.object({
   userId: z.string().min(1),
});
