import {
   InputControllerDto,
   OutputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import { response } from '@controllers/@shared/protocols';
import {
   InputLoginUserDto,
   OutputLoginUserDto,
} from '@core/usecases/user/login/login.user.dto';
import LoginUserUseCase from '@core/usecases/user/login/login.usecase';
export default class LoginUserController {
   constructor(private readonly loginUserUseCase: LoginUserUseCase) {}
   public async handle(
      input: InputControllerDto<InputLoginUserDto>
   ): Promise<OutputControllerDto<OutputLoginUserDto>> {
      try {
         const output = await this.loginUserUseCase.execute(input.data);
         return response<OutputLoginUserDto>(
            200,
            'User logged successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
