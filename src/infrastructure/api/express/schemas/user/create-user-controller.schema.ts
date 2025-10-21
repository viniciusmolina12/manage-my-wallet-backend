import { z } from 'zod';
import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
export const createUserControllerSchema = z.object({
   name: z
      .string({ message: ERROR_MESSAGES.NAME_REQUIRED })
      .min(1, { message: ERROR_MESSAGES.NAME_INVALID }),
   email: z.string().email({ message: ERROR_MESSAGES.EMAIL_INVALID }),
   password: z.string({ message: ERROR_MESSAGES.PASSWORD_REQUIRED }),
   confirmPassword: z
      .string({ message: ERROR_MESSAGES.PASSWORD_INVALID })
      .min(1, { message: ERROR_MESSAGES.PASSWORD_REQUIRED }),
});
