import { v4 as uuid } from 'uuid';

import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';
import CreateBillUseCaseMapper from './create.usecase.mapper';
import { ItemRepository } from '@core/domain/item/repository/item.repository';
import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import { InputCreateBillDto, OutputCreateBillDto } from './create.bill.dto';
import EntityError from '@core/domain/@shared/error/entity.error';

export default class CreateBillUseCase {
   private readonly billRepository: BillRepository;
   private readonly itemRepository: ItemRepository;

   constructor(billRepository: BillRepository, itemRepository: ItemRepository) {
      this.billRepository = billRepository;
      this.itemRepository = itemRepository;
   }

   async execute(input: InputCreateBillDto): Promise<OutputCreateBillDto> {
      const billItems = await this.addItems(input?.items, input.userId);
      const bill = new Bill(
         uuid(),
         input.name,
         billItems,
         new Date(),
         input.userId,
         input.description
      );
      await this.billRepository.create(bill);
      return CreateBillUseCaseMapper.toOutput(bill);
   }

   private async addItems(
      items: { itemId: string; price: number; quantity: number }[],
      userId: string
   ): Promise<BillItem[]> {
      const billItems: BillItem[] = [];
      if (!items) {
         throw new EntityError('Items is required');
      }
      for (const item of items) {
         const itemFound = await this.itemRepository.findByUser(
            item.itemId,
            userId
         );
         if (!itemFound) {
            throw new EntityError('Item not found');
         }
         const billItem = new BillItem(
            uuid(),
            item.itemId,
            item.price,
            item.quantity
         );
         billItems.push(billItem);
      }
      return billItems;
   }
}
