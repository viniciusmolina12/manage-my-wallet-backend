import {
   InputControllerDto,
   OutputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import CreateUserUseCase from '@core/usecases/user/create/create.usecase';
import {
   InputCreateUserDto,
   OutputCreateUserDto,
} from '@core/usecases/user/create/create.user.dto';
import { response } from '@controllers/@shared/protocols';
export default class CreateUserController {
   constructor(private readonly createUserUseCase: CreateUserUseCase) {}
   public async handle(
      input: InputControllerDto<InputCreateUserDto>
   ): Promise<OutputControllerDto<OutputCreateUserDto>> {
      try {
         const output = await this.createUserUseCase.execute(input.data);
         return response<OutputCreateUserDto>(
            201,
            'User created successfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
