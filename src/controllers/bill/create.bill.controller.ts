import EntityError from "@core/domain/@shared/error/entity.error";
import CreateBillUseCase from "@core/usecases/bill/create/create.usecase";
import { OutputControllerDto, InputControllerDto } from "@controllers/interfaces/controller.dto";
import { response } from "@controllers/interfaces/response";

interface InputCreateBillControllerDto {
    name: string;
    description?: string;
    items: {
        quantity: number;
        price: number;
        itemId: string;
    }[]
}

interface OutputCreateBillControllerDto {
    name: string;
    description?: string;
    total: number;
    items: {
        quantity: number;
        price: number;
        itemId: string;
    }[]
}

export default class CreateBillController {

    constructor(private readonly createBillUseCase: CreateBillUseCase) {
        this.createBillUseCase = createBillUseCase;
    }
    public async handle(input: InputControllerDto<InputCreateBillControllerDto>): Promise<OutputControllerDto<OutputCreateBillControllerDto>> {
        try {
            const output = await this.createBillUseCase.execute(input.data);
            return response<OutputCreateBillControllerDto>(201, 'Bill created successfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}