import EntityError from "@core/domain/@shared/error/entity.error";
import FindItemUseCase from "@core/usecases/item/find/find.usecase";
import { OutputControllerDto, InputControllerDto } from "@controllers/@shared/interfaces/controller.dto";
import { response } from "@controllers/@shared/protocols";

interface InputFindItemControllerDto {
    id: string
}

interface OutputFindItemControllerDto {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
}

export default class FindItemController {

    constructor(private readonly findItemUseCase: FindItemUseCase) {
        this.findItemUseCase = findItemUseCase;
    }
    public async handle(input: InputControllerDto<InputFindItemControllerDto>): Promise<OutputControllerDto<OutputFindItemControllerDto>> {
        try {
            const { id } = input.data;
            const output = await this.findItemUseCase.execute( { id });
            return response<OutputFindItemControllerDto>(200, 'Item founded succesfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}