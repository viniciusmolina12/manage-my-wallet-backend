import EntityError from "@core/domain/@shared/error/entity.error";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";
import { response } from "../interfaces/response";
import FindCategoryUseCase from "@core/usecases/category/find/find.usecase";

interface InputFindCategoryControllerDto {
    id: string
}

interface OutputFindCategoryControllerDto {
    id: string;
    name: string;
    description?: string;
}

export default class FindCategoryController {

    constructor(private readonly findCategoryUseCase: FindCategoryUseCase) {
        this.findCategoryUseCase = findCategoryUseCase;
    }
    public async handle(input: InputControllerDto<InputFindCategoryControllerDto>): Promise<OutputControllerDto<OutputFindCategoryControllerDto>> {
        try {
            const { id } = input.data;
            const output = await this.findCategoryUseCase.execute(id);
            return response<OutputFindCategoryControllerDto>(200, 'Category founded succesfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}