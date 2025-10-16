import { z } from 'zod';

export const updateVendorControllerSchema = z.object({
   id: z.string().min(1),
   name: z.string().min(1),
   userId: z.string().min(1),
});
