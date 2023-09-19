import ListCategoryUseCase from "@core/usecases/category/list/list.usecase";
import EntityError from "../../core/domain/@shared/error/entity.error";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";
import { response } from "../interfaces/response";

interface InputListCategoryControllerDto {}

interface OutputListCategoryControllerDto {
    categories: {
        id: string;
        name: string;
        description?: string;
    }[]
}

export default class ListCategoryController {

    constructor(private readonly listCategoryUseCase: ListCategoryUseCase) {
        this.listCategoryUseCase = listCategoryUseCase;
    }
    public async handle(input: InputControllerDto<InputListCategoryControllerDto>): Promise<OutputControllerDto<OutputListCategoryControllerDto>> {
        try {
            const output = await this.listCategoryUseCase.execute();
            return response<OutputListCategoryControllerDto>(200, 'Categories listed succesfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}