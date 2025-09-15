import { v4 as uuid } from 'uuid';
import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import { InputUpdateBillDto, OutputUpdateBillDto } from './update.bill.dto';
import BillItem from '@core/domain/bill/entity/bill-item.vo';
import Bill, { BillId } from '@core/domain/bill/entity/bill.entity';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import EntityError from '@core/domain/@shared/error/entity.error';
import { ItemId } from '@core/domain/item/entity/item.entity';
import { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
export default class UpdateBillUseCase {
   private readonly billRepository: BillRepository;
   private readonly vendorRepository: VendorRepository;
   constructor(
      billRepository: BillRepository,
      vendorRepository: VendorRepository
   ) {
      this.billRepository = billRepository;
      this.vendorRepository = vendorRepository;
   }

   async execute(input: InputUpdateBillDto): Promise<OutputUpdateBillDto> {
      const { id, userId } = input;
      const billExists = await this.billRepository.findByUser(id, userId);
      if (!billExists) {
         throw new Error('Bill not exists');
      }
      const vendor = await this.vendorRepository.findByUser(
         input.vendorId,
         userId
      );
      if (!vendor) {
         throw new EntityError('Vendor not exists');
      }

      const billItems: BillItem[] = [];
      input?.items?.map((item) => {
         const billItem = new BillItem(
            new ItemId(item.itemId),
            item.price,
            item.quantity
         );
         billItems.push(billItem);
      });

      const bill = new Bill(
         new BillId(input.id),
         input.name,
         input.date,
         billItems,
         new VendorId(input.vendorId),
         new UserId(input.userId),
         input.description
      );
      (await this.billRepository.update(bill)) as Bill;
      return {
         id: bill.id,
         name: bill.name,
         description: bill.description,
         vendorId: bill.vendorId.id,
         total: bill.total,
         date: bill.date,
         createdAt: billExists.createdAt,
         updatedAt: bill.updatedAt,
         items: bill.items.map((item: BillItem) => ({
            id: item.itemId.id,
            itemId: item.itemId.id,
            price: item.price,
            quantity: item.quantity,
         })),
      };
   }
}
