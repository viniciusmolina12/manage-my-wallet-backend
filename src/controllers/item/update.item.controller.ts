import EntityError from "../../core/domain/@shared/error/entity.error";
import FindItemUseCase from "../../core/usecases/item/find/find.usecase";
import ListItemUsecase from "../../core/usecases/item/list/list.usecase";
import UpdateItemUseCase from "../../core/usecases/item/update/update.usecase";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";
import { response } from "../interfaces/response";

interface InputUpdateItemControllerDto {
    id: string;
    name: string;
    categoryId: string;
    description?: string;
}

interface OutputUpdateItemControllerDto {
    name: string;
    categoryId: string;
    description?: string;
}

export default class UpdateItemController {

    constructor(private readonly updateItemUseCase: UpdateItemUseCase) {
        this.updateItemUseCase = updateItemUseCase;
    }
    public async handle(input: InputControllerDto<InputUpdateItemControllerDto>): Promise<OutputControllerDto<OutputUpdateItemControllerDto>> {
        try {
            const { id, name, categoryId, description } = input.data;
            const output = await this.updateItemUseCase.execute({ id, name, categoryId, description });
            return response<OutputUpdateItemControllerDto>(200, 'Item updated succesfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(400, e.message);
        }
    }

}