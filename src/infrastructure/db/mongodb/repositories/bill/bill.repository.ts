import {
   BillRepository,
   SearchBill,
} from '@core/domain/bill/repository/bill.repository';
import Bill from '@core/domain/bill/entity/bill.entity';
import BillModel from '../../model/bill.model';
import BillItem from '@core/domain/bill/entity/bill-item.entity';
import { Filter, Pagination } from '@core/domain/@shared/filter/filter';
import { BillMapper } from './bill.mapper';

export default class MongoDbBillRepository implements BillRepository {
   async create(entity: Bill): Promise<void> {
      await BillModel.create({
         _id: entity.id,
         name: entity.name,
         date: entity.date,
         userId: entity.userId,
         vendorId: entity.vendorId,
         items: entity.items,
         description: entity.description,
         total: entity.total,
      });
   }
   async update(entity: Bill): Promise<void> {
      await BillModel.findOneAndUpdate(
         { _id: entity.id, userId: entity.userId },
         {
            name: entity.name,
            date: entity.date,
            items: entity.items,
            description: entity.description,
            vendorId: entity.vendorId,
            total: entity.total,
            updatedAt: new Date(),
         }
      );
   }

   async find(id: string): Promise<Bill | null> {
      const billFound = await BillModel.findOne({ _id: id }).populate(
         'items.itemId',
         'vendorId'
      );
      if (!billFound) return null;
      const bill = BillMapper.toDomain(billFound);
      return bill;
   }

   async findAll(): Promise<Bill[]> {
      const result = await BillModel.find();
      return result.map((b) => {
         const billItems = b.items.map(
            (item) =>
               new BillItem(item._id, item._id, item.price, item.quantity)
         );
         const bill = BillMapper.toDomain(b);
         bill.createdAt = b.createdAt;
         bill.updatedAt = b.updatedAt;
         return bill;
      });
   }

   async delete(id: string): Promise<void> {
      await BillModel.findByIdAndDelete({ _id: id });
   }
   async findByUser(id: string, userId: string): Promise<Bill | null> {
      const billFound = await BillModel.findOne({ _id: id, userId }).populate(
         'items.itemId'
      );
      if (!billFound) return null;
      const bill = BillMapper.toDomain(billFound);
      bill.createdAt = billFound.createdAt;
      bill.updatedAt = billFound.updatedAt;
      return bill;
   }

   async findAllByUserAndPeriod(
      userId: string,
      startDate: Date,
      endDate: Date
   ): Promise<Bill[]> {
      const result = await BillModel.find({
         userId,
         date: {
            $gte: startDate,
            $lte: endDate,
         },
      });
      return BillMapper.toDomainList(result);
   }

   async findAllByUser(
      userId: string,
      filter: Filter<SearchBill>
   ): Promise<Pagination<Bill>> {
      const queryFilter = {
         userId,
         ...(filter.search.name && {
            name: { $regex: filter.search.name, $options: 'i' },
         }),
         ...(filter.search.startDate && {
            date: {
               $gte: filter.search.startDate,
            },
         }),
         ...(filter.search.endDate && {
            date: {
               $lte: filter.search.endDate,
            },
         }),
         ...(filter.search.startDate &&
            filter.search.endDate && {
               date: {
                  $gte: filter.search.startDate,
                  $lte: filter.search.endDate,
               },
            }),
         ...(filter.search.vendorId && {
            vendorId: filter.search.vendorId,
         }),
      };
      const result = await BillModel.find(queryFilter)
         .sort({ date: filter.order === 'asc' ? 1 : -1 })
         .skip(filter.skip)
         .limit(filter.limit);
      const bills = BillMapper.toDomainList(result);
      const total = await BillModel.countDocuments(queryFilter);
      const hasNext = total > filter.skip + filter.limit;
      return new Pagination(filter.page, filter.limit, total, hasNext, bills);
   }

   async deleteByUser(id: string, userId: string): Promise<void> {
      await BillModel.findByIdAndDelete({ _id: id, userId });
   }
}
