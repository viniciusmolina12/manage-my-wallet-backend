import UpdateCategoryUseCase from "@core/usecases/category/update/update.usecase";
import EntityError from "../../core/domain/@shared/error/entity.error";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";
import { response } from "../interfaces/response";

interface InputUpdateCategoryControllerDto {
    id: string;
    name: string;
    description?: string;
}

interface OutputUpdateCategoryControllerDto {
    name: string;
    description?: string;
}

export default class UpdateCategoryController {

    constructor(private readonly updateCategoryUseCase: UpdateCategoryUseCase) {
        this.updateCategoryUseCase = updateCategoryUseCase;
    }
    public async handle(input: InputControllerDto<InputUpdateCategoryControllerDto>): Promise<OutputControllerDto<OutputUpdateCategoryControllerDto>> {
        try {
            const { id, name, description } = input.data;
            const output = await this.updateCategoryUseCase.execute({ id, name, description });
            return response<OutputUpdateCategoryControllerDto>(200, 'Category updated succesfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}