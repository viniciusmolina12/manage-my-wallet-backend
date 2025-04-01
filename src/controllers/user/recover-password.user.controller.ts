import {
   InputControllerDto,
   OutputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import { response } from '@controllers/@shared/protocols';
import {
   InputRecoverPasswordUserDto,
   OutputRecoverPasswordUserDto,
} from '@core/usecases/user/recover-password/recover_password.user.dto';
import RecoverPasswordUserUseCase from '@core/usecases/user/recover-password/recover_password.usecase';
export default class RecoverPasswordUserController {
   constructor(
      private readonly recoverPasswordUserUseCase: RecoverPasswordUserUseCase
   ) {}
   public async handle(
      input: InputControllerDto<InputRecoverPasswordUserDto>
   ): Promise<OutputControllerDto<OutputRecoverPasswordUserDto>> {
      try {
         const output = await this.recoverPasswordUserUseCase.execute(
            input.data
         );
         return response<OutputRecoverPasswordUserDto>(
            200,
            'Email sent successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
