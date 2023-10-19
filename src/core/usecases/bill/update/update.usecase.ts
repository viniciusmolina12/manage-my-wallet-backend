import { v4 as uuid } from 'uuid';
import { BillRepository } from "@core/domain/bill/repository/bill.repository";
import { InputUpdateBillDto, OutputUpdateBillDto } from "./update.bill.dto";
import BillItem from "@core/domain/bill/entity/bill-item.entity";
import Bill from '@core/domain/bill/entity/bill.entity';

export default class UpdateBillUseCase { 
    private readonly billRepository: BillRepository;
    constructor(billRepository: BillRepository) {
        this.billRepository = billRepository;
    }

    async execute(input: InputUpdateBillDto): Promise<OutputUpdateBillDto> {
        const billExists = await this.billRepository.find(input.id);
        if(!billExists) {
            throw new Error('Bill not exists');
        }

        const billItems: BillItem[] = []
        input.items.map((item) => {
            const billItem = new BillItem(uuid(), item.itemId, item.price, item.quantity);
            billItems.push(billItem)
        })

        const bill = new Bill(input.id, input.name, billItems, new Date(), input.description);
        await this.billRepository.update(bill) as Bill;
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