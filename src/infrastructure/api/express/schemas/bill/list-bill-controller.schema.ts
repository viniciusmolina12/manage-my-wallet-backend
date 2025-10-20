import { z } from 'zod';

export const listBillControllerSchema = z.object({
   userId: z.string().min(1),
   page: z.number().min(1),
   perPage: z.number().min(1),
   order: z.string().min(1).optional(),
   search: z
      .object({
         name: z.string().optional(),
         vendorId: z.string().optional(),
         startDate: z.coerce.date().optional(),
         endDate: z.coerce.date().optional(),
      })
      .optional(),
});
