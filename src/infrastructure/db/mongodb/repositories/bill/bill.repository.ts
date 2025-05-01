import { BillRepository } from '@core/domain/bill/repository/bill.repository';
import Bill from '@core/domain/bill/entity/bill.entity';
import BillModel from '../../model/bill.model';
import BillItem from '@core/domain/bill/entity/bill-item.entity';

export default class MongoDbBillRepository implements BillRepository {
   async create(entity: Bill): Promise<void> {
      await BillModel.create({
         _id: entity.id,
         name: entity.name,
         userId: entity.userId,
         vendorId: entity.vendorId,
         items: entity.items,
         description: entity.description,
      });
   }
   async update(entity: Bill): Promise<void> {
      await BillModel.findOneAndUpdate(
         { _id: entity.id, userId: entity.userId },
         {
            name: entity.name,
            items: entity.items,
            description: entity.description,
            vendorId: entity.vendorId,
            updatedAt: new Date(),
         }
      );
   }

   async find(id: string): Promise<Bill | null> {
      const bill = await BillModel.findOne({ _id: id }).populate(
         'items.itemId',
         'vendorId'
      );
      if (!bill) return null;
      const billItems = bill.items.map(
         (item) => new BillItem(item._id, item._id, item.price, item.quantity)
      );
      return new Bill(
         bill._id.toString(),
         bill.name,
         billItems,
         bill.vendorId,
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
            bill.vendorId,
            bill.userId,
            bill?.description
         );
      });
   }

   async delete(id: string): Promise<void> {
      await BillModel.findByIdAndDelete({ _id: id });
   }
   async findByUser(id: string, userId: string): Promise<Bill | null> {
      const bill = await BillModel.findOne({ _id: id, userId }).populate(
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
         bill.vendorId,
         bill.userId,
         bill?.description
      );
   }

   async findAllByUser(userId: string): Promise<Bill[]> {
      const result = await BillModel.find({ userId });
      return result.map((bill) => {
         const billItems = bill.items.map(
            (item) =>
               new BillItem(item._id, item._id, item.price, item.quantity)
         );
         return new Bill(
            bill._id.toString(),
            bill.name,
            billItems,
            bill.vendorId,
            bill.userId,
            bill?.description
         );
      });
   }

   async deleteByUser(id: string, userId: string): Promise<void> {
      await BillModel.findByIdAndDelete({ _id: id, userId });
   }
}
