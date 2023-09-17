import EntityError from "../../core/domain/@shared/error/entity.error";
import { CreateItemUseCase } from "../../core/usecases/item/create/create.usecase";
import { OutputControllerDto, InputControllerDto } from "../interfaces/controller.dto";

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
            return {
                data: output,
                code: 201,
                message: "Item created successfully"
            }
        } catch (e: any) {
            if(e instanceof EntityError) {
                return {
                    code: 400,
                    message: e.message
                }
            }
            return {
                code: 400,
                message: e.message
            }
            
        }
    }

}