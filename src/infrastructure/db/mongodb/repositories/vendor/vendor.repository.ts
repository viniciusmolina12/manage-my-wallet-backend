import Category from '@core/domain/category/entity/category.entity';
import { CategoryRepository } from '@core/domain/category/repository/category.repository';
import CategoryModel from '../../model/category.model';
import VendorModel from '../../model/vendor.model';
import Vendor from '@core/domain/vendor/entity/vendor.entity';
import { VendorRepository } from '@core/domain/vendor/repository/vendor.repository';

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
         { name: entity.name, userId: entity.userId }
      );
   }

   async find(id: string): Promise<Vendor | null> {
      const result = await VendorModel.findOne({ _id: id });
      if (!result) return null;
      return new Vendor(result._id.toString(), result.name, result.userId);
   }

   async findByUser(id: string, userId: string): Promise<Vendor | null> {
      const result = await VendorModel.findOne({ _id: id, userId });
      if (!result) return null;
      return new Vendor(result._id.toString(), result.name, result.userId);
   }

   async findAll(): Promise<Vendor[]> {
      const result = await VendorModel.find();
      return result.map(
         (vendor) =>
            new Vendor(vendor._id.toString(), vendor.name, vendor.userId)
      );
   }

   async findAllByUser(userId: string): Promise<Vendor[]> {
      const result = await VendorModel.find({ userId });
      return result.map(
         (vendor) =>
            new Vendor(vendor._id.toString(), vendor.name, vendor.userId)
      );
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
      return new Vendor(result._id.toString(), result.name, result.userId);
   }
}
