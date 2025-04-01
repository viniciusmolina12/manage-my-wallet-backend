import {
   InputControllerDto,
   OutputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import { response } from '@controllers/@shared/protocols';
import ResetPasswordUserUseCase from '@core/usecases/user/reset-password/reset_password.usecase';
import {
   InputResetPasswordUserDto,
   OutputResetPasswordUserDto,
} from '@core/usecases/user/reset-password/reset_password.user.dto';

export default class ResetPasswordUserController {
   constructor(
      private readonly resetPasswordUseCase: ResetPasswordUserUseCase
   ) {}
   public async handle(
      input: InputControllerDto<InputResetPasswordUserDto>
   ): Promise<OutputControllerDto<OutputResetPasswordUserDto>> {
      try {
         const output = await this.resetPasswordUseCase.execute(input.data);
         return response<OutputResetPasswordUserDto>(
            200,
            'Password changed successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
