import EntityError from "../../core/domain/@shared/error/entity.error";
import ListItemUsecase from "../../core/usecases/item/list/list.usecase";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";
import { response } from "../interfaces/response";

interface InputListItemControllerDto {}

interface OutputListItemControllerDto {
    items: {
        id: string;
        name: string;
        description?: string;
        categoryId: string;
    }[]
}

export default class ListItemController {

    constructor(private readonly listItemUseCase: ListItemUsecase) {
        this.listItemUseCase = listItemUseCase;
    }
    public async handle(input: InputControllerDto<InputListItemControllerDto>): Promise<OutputControllerDto<OutputListItemControllerDto>> {
        try {
            const output = await this.listItemUseCase.execute();
            return response<OutputListItemControllerDto>(201, 'Items listed succesfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(400, e.message);
        }
    }

}