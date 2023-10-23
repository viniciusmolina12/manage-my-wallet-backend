import EntityError from "@core/domain/@shared/error/entity.error";
import { OutputControllerDto, InputControllerDto } from "@controllers/interfaces/controller.dto";
import { response } from "@controllers/interfaces/response";
import FindBillUseCase from "@core/usecases/bill/find/find.usecase";

interface InputFindBillControllerDto {
    id: string;
}

interface OutputFindBillControllerDto {
    name: string;
    description?: string;
    total: number;
    items: {
        quantity: number;
        price: number;
        itemId: string;
    }[]
}

export default class FindBillController {

    constructor(private readonly findBillUseCase: FindBillUseCase) {
        this.findBillUseCase = findBillUseCase;
    }
    public async handle(input: InputControllerDto<InputFindBillControllerDto>): Promise<OutputControllerDto<OutputFindBillControllerDto>> {
        try {
            const output = await this.findBillUseCase.execute(input.data);
            return response<OutputFindBillControllerDto>(200, 'Bill founded successfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}