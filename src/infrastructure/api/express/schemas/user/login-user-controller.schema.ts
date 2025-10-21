import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const loginUserControllerSchema = z.object({
   email: z.string().email({ message: ERROR_MESSAGES.EMAIL_INVALID }),
   password: z
      .string({ message: ERROR_MESSAGES.PASSWORD_INVALID })
      .min(1, { message: ERROR_MESSAGES.PASSWORD_REQUIRED }),
});
