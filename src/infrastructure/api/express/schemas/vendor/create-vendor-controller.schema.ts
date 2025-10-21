import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const createVendorControllerSchema = z.object({
   name: z
      .string({ message: ERROR_MESSAGES.NAME_INVALID })
      .min(1, { message: ERROR_MESSAGES.NAME_REQUIRED }),
   userId: z
      .string({ message: ERROR_MESSAGES.USER_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.USER_ID_INVALID }),
});
