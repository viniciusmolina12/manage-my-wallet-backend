import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import { InputFindBillDto, OutputFindBillDto } from './find.bill.dto';
import BillItem from '@core/domain/bill/entity/bill-item.entity';
import EntityError from '@core/domain/@shared/error/entity.error';

export default class FindBillUseCase {
   private readonly billRepository: BillRepository;
   constructor(billRepository: BillRepository) {
      this.billRepository = billRepository;
   }
   async execute(input: InputFindBillDto): Promise<OutputFindBillDto> {
      const { id, userId } = input;
      const bill = await this.billRepository.findByUser(id, userId);
      if (!bill) throw new EntityError('Bill not found');
      return {
         id: bill.id,
         createdDate: bill.createdDate,
         name: bill.name,
         description: bill.description,
         vendorId: bill.vendorId,
         total: bill.total,
         items: bill.items.map((item: BillItem) => ({
            id: item.id,
            itemId: item.itemId,
            price: item.price,
            quantity: item.quantity,
         })),
      };
   }
}
