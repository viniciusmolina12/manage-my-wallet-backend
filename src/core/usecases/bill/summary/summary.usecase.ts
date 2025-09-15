import {
   BillRepository,
   SearchBill,
} from '@core/domain/bill/repository/bill.repository';
import { InputSummaryBillDto, OutputSummaryBillDto } from './summary.bill.dto';
import { PeriodFactory } from './periods';
import { SummaryBillUseCaseMapper } from './summary.usecase.mapper';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import { ItemRepository } from '@core/domain/item/repository/item.repository';

export default class SummaryBillUseCase {
   constructor(
      private readonly billRepository: BillRepository,
      private readonly vendorRepository: VendorRepository,
      private readonly itemRepository: ItemRepository,
      private readonly categoryRepository: CategoryRepository
   ) {
      this.billRepository = billRepository;
      this.vendorRepository = vendorRepository;
      this.itemRepository = itemRepository;
      this.categoryRepository = categoryRepository;
   }

   async execute(input: InputSummaryBillDto): Promise<OutputSummaryBillDto> {
      const { userId, period } = input;
      const today = new Date();
      const interval = PeriodFactory.create(period, today);

      const bills = await this.billRepository.findAllByUserAndPeriod(
         userId,
         interval.startDate,
         interval.endDate
      );

      const itemsIds = new Set(
         bills.flatMap((bill) => bill.items.map((item) => item.itemId.id))
      );
      const items = await this.itemRepository.findItemsByIds(
         Array.from(itemsIds),
         userId
      );
      const categoriesIds = new Set(items.map((item) => item.categoryId));
      const categories = await this.categoryRepository.findCategoriesByIds(
         Array.from(categoriesIds),
         userId
      );
      const vendorsIds = new Set(bills.map((bill) => bill.vendorId.id));
      const vendors = await this.vendorRepository.findVendorsByIds(
         Array.from(vendorsIds),
         userId
      );

      return SummaryBillUseCaseMapper.toOutput(
         bills,
         vendors,
         items,
         categories
      );
   }
}
