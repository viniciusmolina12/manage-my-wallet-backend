import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const deleteVendorControllerSchema = z.object({
   id: z
      .string({ message: ERROR_MESSAGES.ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.ID_INVALID }),
   userId: z
      .string({ message: ERROR_MESSAGES.USER_ID_REQUIRED })
      .uuid({ message: ERROR_MESSAGES.USER_ID_INVALID }),
});
