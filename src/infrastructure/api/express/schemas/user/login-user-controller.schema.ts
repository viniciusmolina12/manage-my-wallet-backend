import { z } from 'zod';

export const loginUserControllerSchema = z.object({
   email: z.string().email(),
   password: z.string().min(1),
});
