import mockDb from '../__mocks__/mockDb';
import VendorModel from '../../model/vendor.model';
import MongoDbVendorRepository from './vendor.repository';
import Vendor from '@core/domain/vendor/entity/vendor.entity';

beforeAll(async () => {
   await mockDb.connect();
});

beforeEach(async () => {
   await mockDb.clear();
});

afterAll(async () => {
   await mockDb.disconnect();
});

describe('MongoDB Vendor Repository tests', () => {
   it('should create a vendor', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      const vendorCreated = await VendorModel.findOne({ _id: vendor.id });
      expect(vendorCreated).toBeTruthy();
      expect(vendorCreated?._id).toBe(vendor.id);
      expect(vendorCreated?.name).toBe(vendor.name);
   });

   it('should update a vendor', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      vendor.changeName('Vendor 2');
      await sut.update(vendor);
      const vendorUpdated = await VendorModel.findOne({ _id: vendor.id });
      expect(vendorUpdated).toBeTruthy();
      expect(vendorUpdated?._id).toBe(vendor.id);
      expect(vendorUpdated?.name).toBe(vendor.name);
   });

   it('should find a vendor', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      const vendorFound = await sut.find(vendor.id);
      expect(vendorFound).toBeTruthy();
      expect(vendorFound?.id).toBe(vendor.id);
      expect(vendorFound?.name).toBe(vendor.name);
   });

   it('should find a vendor by user', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      const vendorFound = await sut.findByUser(vendor.id, vendor.userId);
      expect(vendorFound).toBeTruthy();
      expect(vendorFound?.id).toBe(vendor.id);
      expect(vendorFound?.name).toBe(vendor.name);
   });

   it('should find all vendors', async () => {
      const sut = new MongoDbVendorRepository();
      await VendorModel.create({
         _id: 'any_hash_id',
         name: 'Vendor 1',
         userId: 'any_user_id',
      });
      await VendorModel.create({
         _id: 'any_hash_id_2',
         name: 'Vendor 2',
         userId: 'any_user_id',
      });
      const vendors = await sut.findAll();
      expect(vendors).toBeTruthy();
      expect(vendors.length).toBe(2);
      expect(vendors[0].id).toBe('any_hash_id');
      expect(vendors[0].name).toBe('Vendor 1');
      expect(vendors[1].id).toBe('any_hash_id_2');
      expect(vendors[1].name).toBe('Vendor 2');
   });

   it('should find all vendors by user', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      const vendors = await sut.findAllByUser(vendor.userId);
      expect(vendors).toBeTruthy();
      expect(vendors.length).toBe(1);
      expect(vendors[0].id).toBe(vendor.id);
      expect(vendors[0].name).toBe(vendor.name);
   });

   it('should delete a vendor', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      await sut.delete(vendor.id);
      const vendorDeleted = await VendorModel.findOne({ _id: vendor.id });
      expect(vendorDeleted).toBeNull();
   });

   it('should delete a vendor by user', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      await sut.deleteByUser(vendor.id, vendor.userId);
      const vendorDeleted = await VendorModel.findOne({ _id: vendor.id });
      expect(vendorDeleted).toBeNull();
   });

   it('should find a vendor by name', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      const vendorFound = await sut.findVendorByName(
         vendor.name,
         vendor.userId
      );
      expect(vendorFound).toBeTruthy();
      expect(vendorFound?.id).toBe(vendor.id);
      expect(vendorFound?.name).toBe(vendor.name);
   });

   it('should find a vendor by name and user', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      const vendorFound = await sut.findVendorByName(
         vendor.name,
         vendor.userId
      );
      expect(vendorFound).toBeTruthy();
      expect(vendorFound?.id).toBe(vendor.id);
      expect(vendorFound?.name).toBe(vendor.name);
   });

   it('should update a vendor by user', async () => {
      const sut = new MongoDbVendorRepository();
      const vendor = new Vendor('any_hash_id', 'Vendor 1', 'any_user_id');
      await sut.create(vendor);
      vendor.changeName('Vendor 2');
      await sut.update(vendor);
      const vendorUpdated = await VendorModel.findOne({ _id: vendor.id });
      expect(vendorUpdated).toBeTruthy();
      expect(vendorUpdated?._id).toBe(vendor.id);
      expect(vendorUpdated?.name).toBe(vendor.name);
   });
});
