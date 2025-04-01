import EntityError from '@core/domain/@shared/error/entity.error';
import { InputCreateBillDto } from './create.bill.dto';
import CreateBillUseCase from './create.usecase';

const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
};

describe('Create bill usecase', () => {
   it('should create a bill', async () => {
      const input: InputCreateBillDto = {
         description: 'any_description',
         name: 'any_name',
         items: [
            {
               itemId: 'any_item_id',
               price: 10,
               quantity: 2,
            },
         ],
      };
      const sut = new CreateBillUseCase(mockRepository);
      const bill = await sut.execute(input);
      expect(bill.name).toBe('any_name');
      expect(bill.total).toBe(20);
      expect(bill.description).toBe('any_description');
      expect(bill.items.length).toBe(1);
      expect(bill.items[0].itemId).toBe('any_item_id');
      expect(bill.items[0].price).toBe(10);
      expect(bill.items[0].quantity).toBe(2);
   });

   it('should throw an error if name is empty', async () => {
      const input: InputCreateBillDto = {
         description: 'any_description',
         name: '',
         items: [
            {
               itemId: 'any_item_id',
               price: 10,
               quantity: 2,
            },
         ],
      };
      const sut = new CreateBillUseCase(mockRepository);
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new EntityError('bill: Name is required, ')
      );
   });
});
