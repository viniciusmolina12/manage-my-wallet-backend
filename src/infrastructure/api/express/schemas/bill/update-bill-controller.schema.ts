import z from 'zod';

export const updateBillControllerSchema = z.object({
   id: z.string().min(1),
   name: z.string().min(1),
   userId: z.string().min(1),
   description: z.string().optional(),
   vendorId: z.string().min(1),
   date: z.coerce.date(),
   items: z.object({
      id: z.string().optional(),
      itemId: z.string().min(1),
      price: z.number(),
      quantity: z.number(),
   }),
});
