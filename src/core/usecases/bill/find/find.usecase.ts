import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import { InputFindBillDto, OutputFindBillDto } from './find.bill.dto';
import EntityError from '@core/domain/@shared/error/entity.error';
import { ItemRepository } from '@core/domain/item/repository/item.repository';
import Item from '@core/domain/item/entity/item.entity';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';
import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import Category from '@core/domain/category/entity/category.entity';

export default class FindBillUseCase {
   constructor(
      private readonly billRepository: BillRepository,
      private readonly itemRepository: ItemRepository,
      private readonly vendorRepository: VendorRepository,
      private readonly categoryRepository: CategoryRepository
   ) {
      this.billRepository = billRepository;
      this.itemRepository = itemRepository;
      this.vendorRepository = vendorRepository;
      this.categoryRepository = categoryRepository;
   }
   async execute(input: InputFindBillDto): Promise<OutputFindBillDto> {
      const { id, userId } = input;
      const bill = await this.billRepository.findByUser(id, userId);
      const items = await this.itemRepository.findItemsByIds(
         [...new Set(bill?.items.map((item) => item.itemId.id))],
         userId
      );
      const categories = await this.categoryRepository.findCategoriesByIds(
         [...new Set(items.map((item) => item.categoryId))],
         userId
      );
      const vendor = await this.vendorRepository.findByUser(
         bill?.vendorId.id || '',
         userId
      );

      const billItemsMapped = bill?.items.map((item) => {
         const itemFound = items.find((i: Item) => i.id === item.itemId.id);
         const categoryFound = categories.find(
            (c: Category) => c.id.id === itemFound?.categoryId
         );
         return {
            id: item.itemId.id,
            price: item.price,
            quantity: item.quantity,
            name: itemFound?.name || '',
            description: itemFound?.description || '',
            categoryId: itemFound?.categoryId || '',
            categoryName: categoryFound?.name || '',
         };
      });

      if (!bill) throw new EntityError('Bill not found');
      return {
         id: bill.id,
         name: bill.name,
         description: bill.description,
         vendorId: bill.vendorId.id,
         vendorName: vendor?.name || '',
         total: bill.total,
         date: bill.date,
         createdAt: bill.createdAt,
         updatedAt: bill.updatedAt,
         items: billItemsMapped || [],
      };
   }
}
