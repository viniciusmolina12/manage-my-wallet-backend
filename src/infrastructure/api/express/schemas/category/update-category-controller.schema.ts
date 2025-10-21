import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import z from 'zod';

export const updateCategoryControllerSchema = z.object({
   id: z
      .string({ message: ERROR_MESSAGES.ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.ID_INVALID }),
   name: z
      .string({ message: ERROR_MESSAGES.NAME_REQUIRED })
      .min(1, { message: ERROR_MESSAGES.NAME_MIN_LENGTH }),
   description: z
      .string({ message: ERROR_MESSAGES.DESCRIPTION_INVALID })
      .optional(),
   userId: z
      .string({ message: ERROR_MESSAGES.USER_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.USER_ID_INVALID }),
});
