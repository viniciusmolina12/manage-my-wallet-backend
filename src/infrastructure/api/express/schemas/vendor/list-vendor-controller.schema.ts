import { z } from 'zod';

export const listVendorControllerSchema = z.object({
   userId: z.string().min(1),
});
