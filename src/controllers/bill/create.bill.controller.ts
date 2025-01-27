import EntityError from "@core/domain/@shared/error/entity.error";
import CreateBillUseCase from "@core/usecases/bill/create/create.usecase";
import { OutputControllerDto, InputControllerDto } from "@controllers/@shared/interfaces/controller.dto";
import { response } from "@controllers/@shared/protocols";

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
            const bill = await this.createBillUseCase.execute(input.data);
            const output = {
                name: bill.name,
                description: bill.description,
                total: bill.total,
                items: bill.items.map(item => ({
                    quantity: item.quantity,
                    price: item.price,
                    itemId: item.itemId
                }))
            }
            return response<OutputCreateBillControllerDto>(201, 'Bill created successfully', output);

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}