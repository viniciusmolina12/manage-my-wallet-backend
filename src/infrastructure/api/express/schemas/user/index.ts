import { createUserControllerSchema } from './create-user-controller.schema';
import { loginUserControllerSchema } from './login-user-controller.schema';
import { updateUserControllerSchema } from './update-user-controller.schema';
import { recoverPasswordUserControllerSchema } from './recover-password-user-controller.schema';
import { resetPasswordControllerSchema } from './reset-password-controller.schema';

export const USER_CONTROLLER_SCHEMAS = {
   CREATE: createUserControllerSchema,
   LOGIN: loginUserControllerSchema,
   UPDATE: updateUserControllerSchema,
   RECOVER_PASSWORD: recoverPasswordUserControllerSchema,
   RESET_PASSWORD: resetPasswordControllerSchema,
};
