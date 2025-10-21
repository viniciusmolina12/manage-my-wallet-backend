import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const listItemControllerSchema = z.object({
   userId: z
      .string({ message: ERROR_MESSAGES.USER_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.USER_ID_INVALID }),
});
