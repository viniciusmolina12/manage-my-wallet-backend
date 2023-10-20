import { BillRepository } from "@core/domain/bill/repository/bill.repository";
import { InputListBillDto, OutputListBillDto } from "./list.bill.dto";

export default class ListBillUseCase { 
    private readonly billRepository: BillRepository;
    constructor(billRepository: BillRepository) {
        this.billRepository = billRepository;
    }

    async execute(input: InputListBillDto): Promise<OutputListBillDto>{
        const bills = await this.billRepository.findAll();
        return { bills };
        
    }
}