import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const listItemControllerSchema = z.object({
   userId: z
      .string({ message: ERROR_MESSAGES.USER_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.USER_ID_INVALID }),
   page: z.number({ message: ERROR_MESSAGES.PAGE_INVALID }).optional(),
   perPage: z.number({ message: ERROR_MESSAGES.PER_PAGE_INVALID }).optional(),
   order: z.string({ message: ERROR_MESSAGES.ORDER_INVALID }).optional(),
   search: z
      .object({
         name: z.string().optional(),
      })
      .optional(),
});
