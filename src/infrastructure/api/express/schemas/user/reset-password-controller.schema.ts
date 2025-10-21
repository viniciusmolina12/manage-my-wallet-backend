import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const resetPasswordControllerSchema = z.object({
   token: z
      .string({ message: ERROR_MESSAGES.TOKEN_INVALID })
      .min(1, { message: ERROR_MESSAGES.TOKEN_REQUIRED }),
   password: z
      .string({ message: ERROR_MESSAGES.PASSWORD_INVALID })
      .min(1, { message: ERROR_MESSAGES.PASSWORD_REQUIRED }),
});
