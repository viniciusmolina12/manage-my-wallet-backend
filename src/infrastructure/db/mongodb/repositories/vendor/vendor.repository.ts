import VendorModel from '../../model/vendor.model';
import Vendor, { VendorId } from '@core/domain/vendor/entity/vendor.entity';
import {
   VendorRepository,
   SearchVendor,
} from '@core/domain/vendor/repository/vendor.repository';
import { UserId } from '@core/domain/user/entity/user.entity';
import { Filter, Pagination } from '@core/domain/@shared/filter/filter';

export default class MongoDbVendorRepository implements VendorRepository {
   async create(entity: Vendor): Promise<void> {
      await VendorModel.create({
         _id: entity.id,
         name: entity.name,
         userId: entity.userId,
      });
   }
   async update(entity: Vendor): Promise<void> {
      await VendorModel.findOneAndUpdate(
         { _id: entity.id },
         {
            name: entity.name,
            userId: entity.userId,
            updatedAt: new Date(),
         }
      );
   }

   async find(id: string): Promise<Vendor | null> {
      const result = await VendorModel.findOne({ _id: id });
      if (!result) return null;
      const vendor = new Vendor(
         new VendorId(result._id.toString()),
         result.name,
         new UserId(result.userId)
      );
      vendor.createdAt = result.createdAt;
      vendor.updatedAt = result.updatedAt;
      return vendor;
   }

   async findByUser(id: string, userId: string): Promise<Vendor | null> {
      const result = await VendorModel.findOne({ _id: id, userId });
      if (!result) return null;
      const vendor = new Vendor(
         new VendorId(result._id.toString()),
         result.name,
         new UserId(result.userId)
      );
      vendor.createdAt = result.createdAt;
      vendor.updatedAt = result.updatedAt;
      return vendor;
   }

   async findAll(): Promise<Vendor[]> {
      const result = await VendorModel.find();
      return result.map((v) => {
         const vendor = new Vendor(
            new VendorId(v._id.toString()),
            v.name,
            new UserId(v.userId)
         );
         vendor.createdAt = v.createdAt;
         vendor.updatedAt = v.updatedAt;
         return vendor;
      });
   }

   async findAllByUser(
      userId: string,
      filter: Filter<SearchVendor>
   ): Promise<Pagination<Vendor>> {
      const queryFilter = {
         userId,
         ...(filter.search.name && {
            name: { $regex: filter.search.name, $options: 'i' },
         }),
      };
      const result = await VendorModel.find(queryFilter)
         .sort({ name: filter.order === 'asc' ? 1 : -1 })
         .skip(filter.skip)
         .limit(filter.limit);
      const vendors = result.map((v) => {
         const vendor = new Vendor(
            new VendorId(v._id),
            v.name,
            new UserId(v.userId)
         );
         vendor.createdAt = v.createdAt;
         vendor.updatedAt = v.updatedAt;
         return vendor;
      });
      const total = await VendorModel.countDocuments({ userId });
      const hasNext = total > filter.skip + filter.limit;
      return new Pagination(filter.page, filter.limit, total, hasNext, vendors);
   }
   async findVendorsByIds(ids: string[], userId: string): Promise<Vendor[]> {
      const result = await VendorModel.find({ _id: { $in: ids }, userId });
      return result.map((v) => {
         const vendor = new Vendor(
            new VendorId(v._id),
            v.name,
            new UserId(v.userId)
         );
         vendor.createdAt = v.createdAt;
         vendor.updatedAt = v.updatedAt;
         return vendor;
      });
   }

   async delete(id: string): Promise<void> {
      await VendorModel.findByIdAndDelete({ _id: id });
   }

   async deleteByUser(id: string, userId: string): Promise<void> {
      await VendorModel.findByIdAndDelete({ _id: id, userId });
   }

   async findVendorByName(
      name: string,
      userId: string
   ): Promise<Vendor | null> {
      const result = await VendorModel.findOne({ name: name, userId });
      if (!result) return null;
      const vendor = new Vendor(
         new VendorId(result._id),
         result.name,
         new UserId(result.userId)
      );
      vendor.createdAt = result.createdAt;
      vendor.updatedAt = result.updatedAt;
      return vendor;
   }
}
