import { z } from 'zod';

export const createBillControllerSchema = z.object({
   name: z.string().min(1),
   description: z.string().optional(),
   vendorId: z.string().min(1),
   date: z.coerce.date(),
   items: z.array(
      z.object({
         quantity: z.number(),
         price: z.number(),
         itemId: z.string().min(1),
      })
   ),
});
