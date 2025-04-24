import Category from '@core/domain/category/entity/category.entity';
import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import CategoryModel from '../../model/category.model';
import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import Bill from '@core/domain/bill/entity/bill.entity';
import BillModel from '../../model/bill.model';
import BillItem from '@core/domain/bill/entity/bill-item.entity';

export default class MongoDbBillRepository implements BillRepository {
   async create(entity: Bill): Promise<void> {
      console.log('CRIACAODOBILL', entity);
      await BillModel.create({
         _id: entity.id,
         name: entity.name,
         userId: entity.userId,
         items: entity.items,
         createdDate: entity.createdDate,
         description: entity.description,
      });
   }
   async update(entity: Bill): Promise<void> {
      await BillModel.findOneAndUpdate(
         { _id: entity.id },
         {
            name: entity.name,
            items: entity.items,
            description: entity.description,
         }
      );
   }

   async find(id: string): Promise<Bill | null> {
      const bill = await BillModel.findOne({ _id: id }).populate(
         'items.itemId'
      );
      if (!bill) return null;
      const billItems = bill.items.map(
         (item) => new BillItem(item._id, item._id, item.price, item.quantity)
      );
      return new Bill(
         bill._id.toString(),
         bill.name,
         billItems,
         bill.createdDate,
         bill.userId,
         bill?.description
      );
   }

   async findAll(): Promise<Bill[]> {
      const result = await BillModel.find();
      return result.map((bill) => {
         const billItems = bill.items.map(
            (item) =>
               new BillItem(item._id, item._id, item.price, item.quantity)
         );
         return new Bill(
            bill._id.toString(),
            bill.name,
            billItems,
            bill.createdDate,
            bill.userId,
            bill?.description
         );
      });
   }

   async delete(id: string): Promise<void> {
      await BillModel.findByIdAndDelete({ _id: id });
   }
}
