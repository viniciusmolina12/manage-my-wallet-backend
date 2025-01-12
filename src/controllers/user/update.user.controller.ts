import EntityError from "@core/domain/@shared/error/entity.error";
import UpdateUserUseCase from "@core/usecases/user/update/update.usecase";
import { InputControllerDto, OutputControllerDto } from "@controllers/@shared/interfaces/controller.dto";
import { response } from "@controllers/@shared/protocols";
import { InputUpdateUserDto, OutputUpdateUserDto } from "@core/usecases/user/update/update.user.dto";

export default class UpdateUserController {
    constructor(private readonly updateUserUseCase: UpdateUserUseCase){}
    public async handle(input: InputControllerDto<InputUpdateUserDto>): Promise<OutputControllerDto<OutputUpdateUserDto>> {
        try {
            const output = await this.updateUserUseCase.execute(input.data);
            return response<OutputUpdateUserDto>(200, 'User updated successfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }
}