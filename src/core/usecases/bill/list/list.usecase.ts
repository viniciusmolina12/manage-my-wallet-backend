import {
   BillRepository,
   SearchBill,
} from '@core/domain/bill/repository/bill.repository';
import { InputListBillDto, OutputListBillDto } from './list.bill.dto';
import { Filter } from '@core/domain/@shared/filter/filter';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import { ItemRepository } from '@core/domain/item/repository/item.repository';
import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import { ListBillUseCaseMapper } from './list.usecase.mapper';

export default class ListBillUseCase {
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

   async execute(
      input: InputListBillDto,
      filter: Filter<SearchBill>
   ): Promise<OutputListBillDto> {
      const { userId } = input;
      const { data: bills, ...meta } = await this.billRepository.findAllByUser(
         userId,
         filter
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
      const total = await this.billRepository.getTotalByUser(
         userId,
         filter.search
      );
      const output = ListBillUseCaseMapper.toOutput(
         bills,
         vendors,
         items,
         categories
      );
      return { bills: output.bills, meta: { ...meta }, total };
   }
}
