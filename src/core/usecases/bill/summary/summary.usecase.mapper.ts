import Bill from '@core/domain/bill/entity/bill.entity';
import { OutputSummaryBillDto } from './summary.bill.dto';
import BillItem from '@core/domain/bill/entity/bill-item.vo';
import Vendor from '@core/domain/vendor/entity/vendor.entity';
import Item from '@core/domain/item/entity/item.entity';
import Category from '@core/domain/category/entity/category.entity';

export class SummaryBillUseCaseMapper {
   static toOutput(
      entity: Bill[],
      vendors: Vendor[],
      items: Item[],
      categories: Category[]
   ): OutputSummaryBillDto {
      return {
         bills: entity.map((bill) => {
            return {
               id: bill.id,
               name: bill.name,
               vendorId: bill.vendorId.id,
               vendorName:
                  vendors.find((vendor) => vendor.id === bill.vendorId.id)
                     ?.name || '',
               total: bill.total,
               createdAt: bill.createdAt,
               updatedAt: bill.updatedAt,
               date: bill.date.toISOString().split('T')[0],
               description: bill?.description,
               items: bill.items.map((item: BillItem) => {
                  const itemFound = items.find((i) => i.id === item.itemId.id);
                  const categoryFound = categories.find(
                     (c) => c.id.id === itemFound?.categoryId
                  );
                  return {
                     itemId: item.itemId.id,
                     price: item.price,
                     quantity: item.quantity,
                     categoryId: categoryFound?.id.id || '',
                     categoryName: categoryFound?.name || '',
                     description: itemFound?.description || '',
                  };
               }),
            };
         }),
      };
   }
}
