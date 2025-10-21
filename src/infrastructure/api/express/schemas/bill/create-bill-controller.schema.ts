import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const createBillControllerSchema = z.object({
   name: z
      .string({ message: ERROR_MESSAGES.NAME_REQUIRED })
      .min(1, { message: ERROR_MESSAGES.NAME_INVALID }),
   description: z.string().optional(),
   vendorId: z
      .string({ message: ERROR_MESSAGES.VENDOR_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.VENDOR_ID_INVALID }),
   date: z.coerce.date({ message: ERROR_MESSAGES.DATE_REQUIRED }),
   items: z.array(
      z.object({
         quantity: z
            .number({ message: ERROR_MESSAGES.QUANTITY_REQUIRED })
            .positive({ message: ERROR_MESSAGES.QUANTITY_INVALID }),
         price: z
            .number({ message: ERROR_MESSAGES.PRICE_REQUIRED })
            .positive({ message: ERROR_MESSAGES.PRICE_INVALID }),
         itemId: z
            .string({ message: ERROR_MESSAGES.ITEM_ID_REQUIRED })
            .uuid({ message: ERROR_MESSAGES.ITEM_ID_INVALID }),
      })
   ),
});
