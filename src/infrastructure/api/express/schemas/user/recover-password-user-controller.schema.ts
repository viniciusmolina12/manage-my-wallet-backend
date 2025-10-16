import { z } from 'zod';

export const recoverPasswordUserControllerSchema = z.object({
   email: z.string().email(),
});
