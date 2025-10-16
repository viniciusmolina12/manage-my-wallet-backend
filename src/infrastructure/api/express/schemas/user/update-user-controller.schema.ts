import { z } from 'zod';

export const updateUserControllerSchema = z.object({
   id: z.string().min(1),
   name: z.string().min(1),
   email: z.string().email(),
});
