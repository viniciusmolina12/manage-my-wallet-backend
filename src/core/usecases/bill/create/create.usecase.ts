import { v4 as uuid } from 'uuid';

import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';
import CreateBillUseCaseMapper from './create.usecase.mapper';
import { ItemRepository } from '@core/domain/item/repository/item.repository';
import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import { InputCreateBillDto, OutputCreateBillDto } from './create.bill.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';

export default class CreateBillUseCase {
   private readonly billRepository: BillRepository;
   private readonly itemRepository: ItemRepository;
   private readonly vendorRepository: VendorRepository;

   constructor(
      billRepository: BillRepository,
      itemRepository: ItemRepository,
      vendorRepository: VendorRepository
   ) {
      this.billRepository = billRepository;
      this.itemRepository = itemRepository;
      this.vendorRepository = vendorRepository;
   }

   async execute(input: InputCreateBillDto): Promise<OutputCreateBillDto> {
      const vendor = await this.vendorRepository.findByUser(
         input.vendorId,
         input.userId
      );
      if (!vendor) {
         throw new EntityError('Vendor not found');
      }

      const billItems = await this.addItems(input?.items, input.userId);
      const bill = new Bill(
         uuid(),
         input.name,
         billItems,
         input.vendorId,
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
