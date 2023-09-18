import EntityError from "../../core/domain/@shared/error/entity.error";
import CreateItemUseCase  from "../../core/usecases/item/create/create.usecase";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";
import { response } from "../interfaces/response";

interface InputCreateItemControllerDto {
    name: string;
    description?: string;
    categoryId: string;
}

interface OutputCreateItemControllerDto {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
}

export default class CreateItemController {

    constructor(private readonly createItemUseCase: CreateItemUseCase) {
        this.createItemUseCase = createItemUseCase;
    }
    public async handle(input: InputControllerDto<InputCreateItemControllerDto>): Promise<OutputControllerDto<OutputCreateItemControllerDto>> {
        try {
            const { name, description, categoryId } = input.data;
            const output = await this.createItemUseCase.execute({ name, description, categoryId });
            return response<OutputCreateItemControllerDto>(201, 'Item created successfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}