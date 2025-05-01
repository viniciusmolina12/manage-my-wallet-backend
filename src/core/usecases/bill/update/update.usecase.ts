import { v4 as uuid } from 'uuid';
import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import { InputUpdateBillDto, OutputUpdateBillDto } from './update.bill.dto';
import BillItem from '@core/domain/bill/entity/bill-item.entity';
import Bill from '@core/domain/bill/entity/bill.entity';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import EntityError from '@core/domain/@shared/error/entity.error';
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
            uuid(),
            item.itemId,
            item.price,
            item.quantity
         );
         billItems.push(billItem);
      });

      const bill = new Bill(
         input.id,
         input.name,
         input.date,
         billItems,
         input.vendorId,
         input.userId,
         input.description
      );
      (await this.billRepository.update(bill)) as Bill;
      return {
         id: bill.id,
         name: bill.name,
         description: bill.description,
         vendorId: bill.vendorId,
         total: bill.total,
         date: bill.date,
         createdAt: billExists.createdAt,
         updatedAt: bill.updatedAt,
         items: bill.items.map((item: BillItem) => ({
            id: item.id,
            itemId: item.itemId,
            price: item.price,
            quantity: item.quantity,
         })),
      };
   }
}
