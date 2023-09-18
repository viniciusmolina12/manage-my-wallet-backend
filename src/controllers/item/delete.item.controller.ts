import EntityError from "../../core/domain/@shared/error/entity.error";
import DeleteItemUseCase from "../../core/usecases/item/delete/delete.usecase";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";
import { response } from "../interfaces/response";

interface InputDeleteItemControllerDto {
    id: string;
}

interface OutputDeleteItemControllerDto {}

export default class DeleteItemController {

    constructor(private readonly deleteItemUseCase: DeleteItemUseCase) {
        this.deleteItemUseCase = deleteItemUseCase;
    }
    public async handle(input: InputControllerDto<InputDeleteItemControllerDto>): Promise<OutputControllerDto<OutputDeleteItemControllerDto>> {
        try {
            const { id } = input.data;
            await this.deleteItemUseCase.execute(id);
            return response<OutputDeleteItemControllerDto>(200, 'Item deleted succesfully');

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(400, e.message);
        }
    }

}