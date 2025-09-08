import EntityError from '../../../@shared/error/entity.error';
import Vendor, { VendorId } from '../vendor.entity';
import { UserId } from '@core/domain/user/entity/user.entity';

describe('Vendor entity unit tests', () => {
   it('should throw if name is empty', () => {
      expect(() => {
         const vendor = new Vendor(new VendorId(), '', new UserId());
      }).toThrow(new EntityError('vendor: Name is required, '));
   });

   it('should change name', () => {
      const id = new VendorId();
      const vendor = new Vendor(id, 'Vendor', new UserId());
      expect(vendor.name).toBe('Vendor');
      vendor.changeName('Vendor 2');
      expect(vendor.name).toBe('Vendor 2');
      expect(vendor.id).toBe(id.id);
   });

   it('should throw a error if new name is empty', () => {
      const vendor = new Vendor(new VendorId(), 'Vendor', new UserId());
      expect(() => {
         vendor.changeName('');
      }).toThrow(new EntityError('vendor: Name is required, '));
   });
});
