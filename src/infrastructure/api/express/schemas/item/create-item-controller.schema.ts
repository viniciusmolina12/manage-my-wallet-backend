import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const createItemControllerSchema = z.object({
   name: z
      .string({ message: ERROR_MESSAGES.NAME_REQUIRED })
      .min(1, { message: ERROR_MESSAGES.NAME_INVALID }),
   description: z
      .string({ message: ERROR_MESSAGES.DESCRIPTION_INVALID })
      .optional(),
   categoryId: z
      .string({ message: ERROR_MESSAGES.CATEGORY_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.CATEGORY_ID_INVALID }),
   userId: z
      .string({ message: ERROR_MESSAGES.USER_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.USER_ID_INVALID }),
});
