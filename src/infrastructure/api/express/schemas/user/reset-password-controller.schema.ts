import { z } from 'zod';

export const resetPasswordControllerSchema = z.object({
   token: z.string().min(1),
   password: z.string().min(6),
});
