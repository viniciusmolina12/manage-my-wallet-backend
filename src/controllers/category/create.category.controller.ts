import EntityError from "@core/domain/@shared/error/entity.error";
import { OutputControllerDto, InputControllerDto } from "@controllers/interfaces/controller.dto";
import { response } from "@controllers/interfaces/response";
import CreateCategoryUseCase from "@core/usecases/category/create/create.usecase";

interface InputCreateCategoryControllerDto {
    name: string;
    description?: string;
    categoryId: string;
}

interface OutputCreateCategoryControllerDto {
    id: string;
    name: string;
    description?: string;
}

export default class CreateCategoryController {

    constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {
        this.createCategoryUseCase = createCategoryUseCase;
    }
    public async handle(input: InputControllerDto<InputCreateCategoryControllerDto>): Promise<OutputControllerDto<OutputCreateCategoryControllerDto>> {
        try {
            const { name, description } = input.data;
            const output = await this.createCategoryUseCase.execute({ name, description });
            return response<OutputCreateCategoryControllerDto>(201, 'Category created successfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}