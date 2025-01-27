import EntityError from "@core/domain/@shared/error/entity.error";
import { OutputControllerDto, InputControllerDto } from "@controllers/@shared/interfaces/controller.dto";
import { response } from "@controllers/@shared/protocols";
import DeleteBillUseCase from "@core/usecases/bill/delete/delete.usecase";

interface InputDeleteBillControllerDto {
    id: string
}

type OutputDeleteBillControllerDto = null

export default class DeleteBillController {

    constructor(private readonly deleteBillUseCase: DeleteBillUseCase) {
        this.deleteBillUseCase = deleteBillUseCase;
    }
    public async handle(input: InputControllerDto<InputDeleteBillControllerDto>): Promise<OutputControllerDto<OutputDeleteBillControllerDto>> {
        try {
            await this.deleteBillUseCase.execute(input.data.id);
            return response<OutputDeleteBillControllerDto>(200, 'Bill deleted successfully');

        } catch (e: any) {
            if(e instanceof EntityError) return response(400, e.message);
            return response(500, e.message);
        }
    }

}