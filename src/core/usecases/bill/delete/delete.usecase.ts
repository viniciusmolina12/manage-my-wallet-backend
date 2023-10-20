import { BillRepository } from "@core/domain/bill/repository/bill.repository";
import { InputDeleteBillDto, OutputDeleteBillDto } from "./delete.bill.dto";

export default class DeleteBillUseCase {
    private readonly billRepository: BillRepository;

    constructor(billRepository: BillRepository) {
        this.billRepository = billRepository;
    }

    async execute(input: InputDeleteBillDto): Promise<OutputDeleteBillDto> {
        const bill = await this.billRepository.find(input);
        if(!bill) throw new Error('Bill not found');
        await this.billRepository.delete(input);
    }
}