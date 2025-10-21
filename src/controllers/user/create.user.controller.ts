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
import { Validator } from '@core/interfaces/validator.interface';
export default class CreateUserController {
   constructor(
      private readonly createUserUseCase: CreateUserUseCase,
      private readonly validator: Validator
   ) {
      this.createUserUseCase = createUserUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputCreateUserDto>
   ): Promise<OutputControllerDto<OutputCreateUserDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
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
