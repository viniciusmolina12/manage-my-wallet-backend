import EntityError from "@core/domain/@shared/error/entity.error";
import { OutputControllerDto, InputControllerDto } from "@controllers/@shared/interfaces/controller.dto";
import { response } from "@controllers/@shared/protocols";
import ListBillUseCase from "@core/usecases/bill/list/list.usecase";

interface InputListBillControllerDto {}

interface OutputListBillControllerDto {
    bills: {
        name: string;
        description?: string;
        total: number;
        items: {
            quantity: number;
            price: number;
            itemId: string;
        }[]
    }[]
}

export default class ListBillController {

    constructor(private readonly listBillUseCase: ListBillUseCase) {
        this.listBillUseCase = listBillUseCase;
    }
    public async handle(input: InputControllerDto<InputListBillControllerDto>): Promise<OutputControllerDto<OutputListBillControllerDto>> {
        try {
            const output = await this.listBillUseCase.execute(input.data);
            return response<OutputListBillControllerDto>(200, 'Bills listed successfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}