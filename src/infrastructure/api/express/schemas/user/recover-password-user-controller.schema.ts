import { ERROR_MESSAGES } from '@controllers/@shared/error-messages';
import { z } from 'zod';

export const recoverPasswordUserControllerSchema = z.object({
   email: z.string().email({ message: ERROR_MESSAGES.EMAIL_INVALID }),
});
