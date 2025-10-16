import { z } from 'zod';

export const createVendorControllerSchema = z.object({
   name: z.string().min(1),
   userId: z.string().min(1),
});
