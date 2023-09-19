import DeleteCategoryUseCase from "@core/usecases/category/delete/delete.usecase";
import EntityError from "../../core/domain/@shared/error/entity.error";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";
import { response } from "../interfaces/response";

interface InputDeleteCategoryControllerDto {
    id: string;
}

interface OutputDeleteCategoryControllerDto {}

export default class DeleteCategoryController {

    constructor(private readonly deleteCategoryUseCase: DeleteCategoryUseCase) {
        this.deleteCategoryUseCase = deleteCategoryUseCase;
    }
    public async handle(input: InputControllerDto<InputDeleteCategoryControllerDto>): Promise<OutputControllerDto<OutputDeleteCategoryControllerDto>> {
        try {
            const { id } = input.data;
            await this.deleteCategoryUseCase.execute(id);
            return response<OutputDeleteCategoryControllerDto>(200, 'Category deleted succesfully');

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}