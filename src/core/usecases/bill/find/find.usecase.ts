import { BillRepository } from "@core/domain/bill/repository/bill.repository";
import { InputFindBillDto, OutputFindBillDto } from "./find.bill.dto";
import BillItem from "@core/domain/bill/entity/bill-item.entity";

export default class FindBillUseCase {
    private readonly billRepository: BillRepository;
    constructor(billRepository: BillRepository) {
        this.billRepository = billRepository;
    }
    async execute(input: InputFindBillDto): Promise<OutputFindBillDto> {
        const bill = await this.billRepository.find(input.id);
        if (!bill) throw new Error('Bill not found');
        return {
            id: bill.id,
            createdDate: bill.createdDate,
            name: bill.name,
            description: bill.description,
            total: bill.total,
            items: bill.items.map((item: BillItem) => ({
                id: item.id,
                itemId: item.itemId,
                price: item.price,
                quantity: item.quantity
            })) 
        }
    
    }
}